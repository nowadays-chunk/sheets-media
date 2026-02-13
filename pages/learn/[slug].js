// ============================================================================
// pages/learn/[slug].jsx
// ============================================================================

import React, { useState } from "react";
import Head from 'next/head';
import { Box, Button, Typography } from "@mui/material";
import SongFullscreenPlayer from "@/components/Pages/LearnSongs/SongFullscreenPlayer";
import { DEFAULT_KEYWORDS } from "../../data/seo";

/* ============================================================================
   PAGE
============================================================================ */

export default function LearnSong({ song }) {
  const [fullscreen, setFullscreen] = useState(false);

  const playableLines = song.sections
    .flatMap((s) => s.lines)
    .filter((l) => l.chunks.some((c) => c.chord));

  return (
    <>
      <Head>
        <title>{`${song.title} by ${song.artist} | Learn Guitar`}</title>
        <meta
          name="description"
          content={`Learn to play ${song.title} by ${song.artist} on guitar. Interactive chord charts, lyrics, and fullscreen player for practicing guitar songs.`}
        />
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
      </Head>
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
      </Box>
    </>
  );
}

/* ============================================================================
   SSG
============================================================================ */

export async function getStaticPaths() {
  // We return an empty array and use fallback: 'blocking'
  // to avoid loading all song files into memory during build.
  // Next.js will generate these pages on-demand.
  return {
    paths: [],
    fallback: "blocking",
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
