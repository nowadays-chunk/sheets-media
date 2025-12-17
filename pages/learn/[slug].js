// ============================================================
// pages/learn/[slug].jsx
// ============================================================

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import SongFullscreenPlayer from "@/components/Pages/LearnSongs/SongFullscreenPlayer";
import { styled } from "@mui/system";

const Chord = styled("span")({
  fontWeight: 800,
  border: "1px solid #ccc",
  borderRadius: 10,
  padding: "6px 12px",
  marginRight: 10,
  background: "#fafafa",
});
/* ============================================================
   PAGE
============================================================ */

export default function LearnSong({ song }) {
  const [fullscreen, setFullscreen] = useState(false);

  const playableLines = song.sections
    .flatMap((s) => s.lines)
    .filter((l) => l.chunks.some((c) => c.chord));

  return (
    <Box maxWidth={900} mx="auto" p={3}>
      <Typography variant="h4">{song.title}</Typography>
      <Typography variant="h6">{song.artist}</Typography>

      <Box my={2}>
        <Button variant="contained" onClick={() => setFullscreen(true)}>
          Fullscreen Play
        </Button>
      </Box>

      {playableLines.map((line, i) => (
        <Box key={i} mb={1}>
          {line.chunks.map((c, k) => (
            <span key={k} style={{ marginRight: 10 }}>
              <Chord>{c.chord}</Chord> {c.lyrics}
            </span>
          ))}
        </Box>
      ))}

      <SongFullscreenPlayer
        open={fullscreen}
        lines={playableLines}
        onClose={() => setFullscreen(false)}
      />
    </Box>
  );
}

/* ============================================================
   SSG
============================================================ */

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");

  const dir = path.join(process.cwd(), "songs");
  const files = fs.readdirSync(dir);

  return {
    paths: files.map((f) => ({
      params: { slug: f.replace(".json", "") },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const song = await import(`../../songs/${params.slug}.json`);

  return {
    props: {
      song: song.default ?? song,
    },
  };
}
