import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import SongFullscreenPlayer from "@/components/Pages/LearnSongs/SongFullscreenPlayer";
import { DEFAULT_KEYWORDS } from "../../data/seo";

/* ============================================================================
   PAGE
============================================================================ */

export default function LearnSong({ title, artist, slug }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/songs/${slug}.json`);
        if (!res.ok) throw new Error("Song not found");
        const data = await res.json();
        setSong(data);
      } catch (err) {
        console.error("Error fetching song:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSong();
  }, [slug]);

  const playableLines = song ? song.sections
    .flatMap((s) => s.lines)
    .filter((l) => l.chunks.some((c) => c.chord)) : [];

  return (
    <>
      <Head>
        <title>{`${song?.title || title} by ${song?.artist || artist} | Learn Guitar`}</title>
        <meta
          name="description"
          content={`Learn to play ${song?.title || title} by ${song?.artist || artist} on guitar. Interactive chord charts, lyrics, and fullscreen player for practicing guitar songs.`}
        />
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
      </Head>
      <Box maxWidth={900} mx="auto" p={3}>
        <Typography variant="h4">{song?.title || title}</Typography>
        <Typography variant="h6">{song?.artist || artist}</Typography>

        {loading && (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" my={5}>
            Error: {error}. Please try again later.
          </Typography>
        )}

        {!loading && !error && song && (
          <>
            <Box my={2}>
              <Button variant="contained" onClick={() => setFullscreen(true)}>
                Fullscreen Play
              </Button>
            </Box>

            {playableLines.map((line, i) => (
              <Box key={i} mb={1}>
                {line.chunks.map((c, k) => (
                  <span key={k} style={{ marginRight: 10 }}>
                    <span
                      style={{
                        fontWeight: 800,
                        border: "1px solid #ccc",
                        borderRadius: 10,
                        padding: "6px 12px",
                        marginRight: 10,
                        background: "#fafafa",
                        display: "inline-block",
                      }}
                    >
                      {c.chord}
                    </span>
                    {c.lyrics}
                  </span>
                ))}
              </Box>
            ))}

            <SongFullscreenPlayer
              open={fullscreen}
              lines={playableLines}
              onClose={() => setFullscreen(false)}
            />
          </>
        )}
      </Box>
    </>
  );
}

import fs from "fs";
import path from "path";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  // We don't read the full file here to avoid bundling the entire 'songs' folder.
  // We can derive a basic title/artist from the slug or use a small lookup if available.
  const slug = params.slug;
  const parts = slug.split("_");
  const title = parts.slice(0, -1).join(" ").replace(/\b\w/g, l => l.toUpperCase()) || slug;
  const artist = parts[parts.length - 1]?.replace(/\b\w/g, l => l.toUpperCase()) || "Unknown";

  return {
    props: {
      slug,
      title,
      artist
    },
    revalidate: 60,
  };
}
