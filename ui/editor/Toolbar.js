// ui/editor/Toolbar.jsx
import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ExposureIcon from "@mui/icons-material/Exposure";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LinkIcon from "@mui/icons-material/Link";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useScore } from "@/core/editor/ScoreContext";

export default function Toolbar() {
  const { input, selection, updateScore } = useScore();
  const [, forceUpdate] = useState({});

  const applyTechnique = (technique) => {
    const selected = selection.selected;
    if (!selected) return;

    updateScore(draft => {
      // Find note in draft by ID
      for (const m of draft.measures) {
        for (const v of m.voices) {
          const el = v.elements.find(e => e.note.id === selected.id);
          if (el) {
            el.note.technique = technique;
            if (technique === 'bend' && !el.note.bend) {
              el.note.bend = 'Full';
            }
            return;
          }
        }
      }
    });
  };

  const dur = (q) => (
    <Tooltip title={`${q} note`}>
      <IconButton onClick={() => input.setDuration(q)}>
        <ExposureIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        padding: 1,
        borderBottom: "1px solid #ddd",
        background: "#fafafa",
      }}
    >
      <Tooltip title="Select tool">
        <IconButton>
          <MusicNoteIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Move Left">
        <IconButton onClick={() => window.dispatchEvent(new CustomEvent('editor:move-cursor', { detail: -1 }))}>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Move Right">
        <IconButton onClick={() => window.dispatchEvent(new CustomEvent('editor:move-cursor', { detail: 1 }))}>
          <ArrowForwardIcon />
        </IconButton>
      </Tooltip>

      {dur('w')} {dur('h')} {dur('q')} {dur('8')} {dur('16')}

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Sharp (#)">
        <IconButton
          onClick={() => input.setAccidental(1)}
          color={input.activeAccidental === 1 ? 'primary' : 'default'}
          sx={{ fontWeight: 'bold', fontSize: 18 }}
        >
          ♯
        </IconButton>
      </Tooltip>
      <Tooltip title="Flat (♭)">
        <IconButton
          onClick={() => input.setAccidental(-1)}
          color={input.activeAccidental === -1 ? 'primary' : 'default'}
          sx={{ fontWeight: 'bold', fontSize: 18 }}
        >
          ♭
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Slide">
        <IconButton onClick={() => applyTechnique('slide')} color={selection.selected?.technique === 'slide' ? 'primary' : 'default'}>
          <TrendingUpIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Hammer-on">
        <IconButton onClick={() => applyTechnique('hammer')} color={selection.selected?.technique === 'hammer' ? 'primary' : 'default'}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Pull-off">
        <IconButton onClick={() => applyTechnique('pull')} color={selection.selected?.technique === 'pull' ? 'primary' : 'default'}>
          <ShowChartIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bend">
        <IconButton onClick={() => applyTechnique('bend')} color={selection.selected?.technique === 'bend' ? 'primary' : 'default'}>
          <GraphicEqIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
