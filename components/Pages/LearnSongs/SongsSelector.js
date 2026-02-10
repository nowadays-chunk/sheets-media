// ============================================================
// SongsSelector.jsx — Infinite Scroll + Search + SSG Routing
// ============================================================

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Stack,
  IconButton
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import songsFirst from "@/output_songs/first-songs.json";
import songsSecond from "@/output_songs/second-songs.json";

/* ============================================================
   HELPERS
============================================================ */
function safeFilename(title, artist) {
  return `${title}_${artist}`
    .normalize("NFD")                 // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")      // keep only a-z 0-9 _
    .replace(/_+/g, "_")              // collapse multiple _
    .replace(/^_|_$/g, "");           // trim _
}

const slugify = (song_name, artist_name, tab_url) => {
  if (tab_url.includes('chordie.com')) {
    return `${artist_name}-${song_name}`
      .replace(/[^\w\d]+/g, "_")
      .toLowerCase();
  } else {
    return safeFilename(song_name, artist_name);
  }
}

/* ============================================================
   STYLES
============================================================ */

const CardsGrid = styled("div")({
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",

  "@media (max-width: 800px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const SongCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "16px",
  border: "1px solid rgba(0,0,0,0.06)",
  background: "#ffffff",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(to bottom, #1976d2, #9c27b0)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    "&::before": {
      opacity: 1
    }
  },
}));

/* ============================================================
   COMPONENT
============================================================ */

const SongsSelector = () => {
  const router = useRouter();

  /* ------------------------------------------------------------
     MERGE LISTS (ONCE)
  ------------------------------------------------------------ */

  const allSongs = useMemo(
    () => [...songsFirst, ...songsSecond],
    []
  );

  /* ------------------------------------------------------------
     STATE
  ------------------------------------------------------------ */

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(100);

  /* ------------------------------------------------------------
     FILTER
  ------------------------------------------------------------ */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allSongs.filter((s) =>
      `${s.song_name} ${s.artist_name}`.toLowerCase().includes(q)
    );
  }, [search, allSongs]);

  const visibleSongs = filtered.slice(0, visibleCount);

  /* ------------------------------------------------------------
     INFINITE SCROLL
  ------------------------------------------------------------ */

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400;

      if (nearBottom) {
        setVisibleCount((c) =>
          Math.min(c + 100, filtered.length)
        );
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  /* ------------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------------ */

  const openSong = (song) => {
    const slug = slugify(song.song_name, song.artist_name, song.tab_url);
    router.push(`/learn/${slug}`);
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Box
      sx={{
        paddingTop: 6,
        paddingBottom: 8,
        paddingLeft: "5%",
        paddingRight: "5%",
        bgcolor: "#fafafa",
        minHeight: "100vh"
      }}
    >
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 2, background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Song Library
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}>
          Explore thousands of interactive songs. Visualize chords, scales, and positions in real-time.
        </Typography>

        <TextField
          label="Search by Artist or Title"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(100);
          }}
          sx={{
            maxWidth: "600px",
            bgcolor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            }
          }}
        />
      </Box>

      <CardsGrid>
        {visibleSongs.map((song) => (
          <SongCard
            key={`${song.song_id}-${song.source}`}
            onClick={() => openSong(song)}
          >
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <MusicNoteIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                <PlayCircleFilledWhiteIcon color="primary" sx={{ fontSize: 28, opacity: 0.8 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5, fontSize: "1.1rem" }}>
                {song.song_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                {song.artist_name}
              </Typography>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {song.key && (
                  <Chip
                    label={`Key: ${song.key}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(0,0,0,0.1)',
                      bgcolor: '#f8f9fa',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
                {song.difficulty && (
                  <Chip
                    label={song.difficulty}
                    size="small"
                    sx={{
                      bgcolor:
                        song.difficulty === 'novice' ? '#e8f5e9' :
                          song.difficulty === 'intermediate' ? '#fff3e0' :
                            '#ffebee',
                      color:
                        song.difficulty === 'novice' ? '#2e7d32' :
                          song.difficulty === 'intermediate' ? '#ef6c00' :
                            '#c62828',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Stack>
            </Box>
          </SongCard>
        ))}
      </CardsGrid>

      {visibleCount < filtered.length && (
        <Typography
          align="center"
          sx={{ mt: 6, opacity: 0.5, fontStyle: "italic" }}
        >
          Scroll for more...
        </Typography>
      )}
    </Box>
  );
};

export default SongsSelector;
