// ui/editor/PalettePanel.jsx
import React from "react";
import { Box, Typography, Button, Menu, MenuItem, Divider } from "@mui/material";
import { useScore } from "@/core/editor/ScoreContext";

import Clef from "@/core/music/score/Clef";
import TimeSignature from "@/core/music/score/TimeSignature";
import KeySignature from "@/core/music/score/KeySignature";
import Note from "@/core/music/score/Note";
import Pitch from "@/core/music/score/Pitch";
import Duration from "@/core/music/score/Duration";

export default function PalettePanel() {
  const { score, updateScore, selection, input, cursorBeat, setCursorBeat } = useScore();

  const [anchorClef, setAnchorClef] = React.useState(null);
  const [anchorTime, setAnchorTime] = React.useState(null);
  const [anchorKey, setAnchorKey] = React.useState(null);
  const [anchorArtic, setAnchorArtic] = React.useState(null);

  const [activeDuration, setActiveDuration] = React.useState("q");

  const selected = selection.selected;

  // -------------------------
  // NOTE INPUT
  // -------------------------
  const handleSetDuration = (d) => {
    setActiveDuration(d);
    if (input) input.setDuration(d);
  };

  const addNote = (step) => {
    if (!score) return;

    // Default: Octave 4, Natural
    const pitch = new Pitch(step, 0, 4);
    const duration = new Duration(activeDuration);

    const note = new Note(pitch, duration);

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });

    setCursorBeat(c => c + duration.total);
  };

  const addRest = () => {
    if (!score) return;
    const duration = new Duration(activeDuration);
    // Pitch doesn't matter for rest but we need a valid note struct
    const note = new Note(new Pitch("B", 0, 4), duration);
    note.isRest = true;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });

    setCursorBeat(c => c + duration.total);
  };

  // -------------------------
  // PALETTE ACTIONS
  // -------------------------
  const applyClef = (clefName) => {
    updateScore(s => {
      s.clef = new Clef(clefName);
    });
    setAnchorClef(null);
  };

  const applyTime = (num, den) => {
    updateScore(s => {
      s.timeSignature = new TimeSignature(num, den);
    });
    setAnchorTime(null);
  };

  const applyKey = (key) => {
    updateScore(s => {
      s.keySignature = new KeySignature(key);
    });
    setAnchorKey(null);
  };

  const applyArticulation = (type) => {
    if (!selected || !selected.pitch) {
      setAnchorArtic(null);
      return;
    }

    updateScore(s => {
      // Find selected note in draft (simplified finding logic or relying on ref if acceptable for properties)
      // Since articulations are properties, we might need ID lookup if we want to be strict.
      // But for now, let's assume direct mutation of the clicked note (which is attached to DOM) 
      // might not propagate to state if we don't find it in the clone.
      // 
      // Reuse the finding logic?
      // For now, let's just implement it safely.
      // 
      // Actually, `selected` IS the note object from the CURRENT render.
      // If we clone, we get NEW objects. A simple mutation on `selected` won't work on `draft`.
      // We must find it.

      let found = null;
      outer: for (const m of s.measures) {
        for (const v of m.voices) {
          const el = v.elements.find(e => e.note.id === selected.id);
          if (el) {
            found = el.note;
            break outer;
          }
        }
      }

      if (found) {
        found.articulations = found.articulations || [];
        found.articulations.push(type);
      }
    });

    setAnchorArtic(null);
  };

  return (
    <Box
      sx={{
        width: 220,
        borderRight: "1px solid #ddd",
        p: 2,
        background: "#fafafa",
        overflowY: "auto",
        height: "100%"
      }}
    >
      {/* INPUT SECTION */}
      <Typography variant="h6" sx={{ mb: 1 }}>Input</Typography>

      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Duration</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {[{ l: 'W', v: 'w' }, { l: 'H', v: 'h' }, { l: 'Q', v: 'q' }, { l: '8', v: '8' }, { l: '16', v: '16' }].map(item => (
          <Button
            key={item.v}
            variant={activeDuration === item.v ? "contained" : "outlined"}
            size="small"
            onClick={() => handleSetDuration(item.v)}
            sx={{ minWidth: 32, p: 0.5, fontSize: "0.75rem" }}
          >
            {item.l}
          </Button>
        ))}
      </Box>

      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Insert</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(step => (
          <Button
            key={step}
            variant="outlined"
            size="small"
            onClick={() => addNote(step)}
            sx={{ minWidth: 28, p: 0.5 }}
          >
            {step}
          </Button>
        ))}
      </Box>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        color="warning"
        onClick={addRest}
        sx={{ mb: 2 }}
      >
        Rest
      </Button>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Palette
      </Typography>

      {/* CLEF */}
      <Button
        fullWidth
        variant="outlined"
        onClick={(e) => setAnchorClef(e.currentTarget)}
      >
        Change Clef
      </Button>

      <Menu
        anchorEl={anchorClef}
        open={Boolean(anchorClef)}
        onClose={() => setAnchorClef(null)}
      >
        <MenuItem onClick={() => applyClef("treble")}>Treble</MenuItem>
        <MenuItem onClick={() => applyClef("bass")}>Bass</MenuItem>
        <MenuItem onClick={() => applyClef("alto")}>Alto</MenuItem>
        <MenuItem onClick={() => applyClef("tenor")}>Tenor</MenuItem>
      </Menu>

      {/* TIME */}
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={(e) => setAnchorTime(e.currentTarget)}
      >
        Time Signature
      </Button>

      <Menu
        anchorEl={anchorTime}
        open={Boolean(anchorTime)}
        onClose={() => setAnchorTime(null)}
      >
        <MenuItem onClick={() => applyTime(4, 4)}>4/4</MenuItem>
        <MenuItem onClick={() => applyTime(3, 4)}>3/4</MenuItem>
        <MenuItem onClick={() => applyTime(6, 8)}>6/8</MenuItem>
        <MenuItem onClick={() => applyTime(2, 4)}>2/4</MenuItem>
      </Menu>

      {/* KEY */}
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={(e) => setAnchorKey(e.currentTarget)}
      >
        Key Signature
      </Button>

      <Menu
        anchorEl={anchorKey}
        open={Boolean(anchorKey)}
        onClose={() => setAnchorKey(null)}
      >
        <MenuItem onClick={() => applyKey("C")}>C / Am</MenuItem>
        <MenuItem onClick={() => applyKey("G")}>G / Em</MenuItem>
        <MenuItem onClick={() => applyKey("D")}>D / Bm</MenuItem>
        <MenuItem onClick={() => applyKey("A")}>A / F#m</MenuItem>
        <MenuItem onClick={() => applyKey("E")}>E / C#m</MenuItem>
        <MenuItem onClick={() => applyKey("F")}>F / Dm</MenuItem>
        <MenuItem onClick={() => applyKey("Bb")}>Bb / Gm</MenuItem>
        <MenuItem onClick={() => applyKey("Eb")}>Eb / Cm</MenuItem>
      </Menu>

      {/* ARTICULATIONS */}
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={(e) => setAnchorArtic(e.currentTarget)}
        disabled={!selected}
      >
        Articulations
      </Button>

      <Menu
        anchorEl={anchorArtic}
        open={Boolean(anchorArtic)}
        onClose={() => setAnchorArtic(null)}
      >
        <MenuItem onClick={() => applyArticulation("staccato")}>
          Staccato
        </MenuItem>
        <MenuItem onClick={() => applyArticulation("accent")}>
          Accent
        </MenuItem>
        <MenuItem onClick={() => applyArticulation("tenuto")}>
          Tenuto
        </MenuItem>
      </Menu>
    </Box>
  );
}
