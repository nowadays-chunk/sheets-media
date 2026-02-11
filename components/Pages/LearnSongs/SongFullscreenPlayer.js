// ============================================================
// SongFullscreenPlayer.jsx
// ============================================================

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";

/* ============================================================
   STYLES
============================================================ */

const Overlay = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: 5000,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backdropFilter: "blur(20px)",
  background:
    "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(230,230,230,0.95))",
});

const Center = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

const LineRow = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "90vw",
});

const Chunk = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  marginRight: 18,
});

const Chord = styled("span")({
  fontWeight: 800,
  border: "1px solid #ccc",
  borderRadius: 10,
  padding: "6px 12px",
  marginRight: 10,
  background: "#fafafa",
});

const Lyrics = styled("span")({
  fontSize: 36,
  fontWeight: 800,
});

const Controls = styled(Box)({
  position: "absolute",
  bottom: 50,
  display: "flex",
  gap: 20,
});

/* ============================================================
   COMPONENT
============================================================ */

const SongFullscreenPlayer = ({ lines, open, onClose }) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() =>
    setIndex((i) => (i + 1 < lines.length ? i + 1 : i)), [lines.length]);
  const prev = useCallback(() =>
    setIndex((i) => (i - 1 >= 0 ? i - 1 : i)), []);

  /* Keyboard */
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, next, prev]);

  if (!open || !lines[index]) return null;

  return (
    <Overlay>
      <Center>
        <LineRow>
          {lines[index].chunks.map((c, i) => (
            <Chunk key={i}>
              {c.chord && <Chord>{c.chord}</Chord>}
              {c.lyrics && <Lyrics>{c.lyrics}</Lyrics>}
            </Chunk>
          ))}
        </LineRow>
      </Center>

      <Controls>
        <Button onClick={prev} variant="outlined">
          ← Previous
        </Button>
        <Button onClick={next} variant="contained">
          Next →
        </Button>
        <Button onClick={onClose} variant="outlined">
          Exit
        </Button>
      </Controls>
    </Overlay>
  );
};

export default SongFullscreenPlayer;
