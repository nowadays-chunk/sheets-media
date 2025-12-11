// ui/editor/PalettePanel.jsx
import React from "react";
import { Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useScore } from "@/core/editor/ScoreContext";

import Clef from "@/core/music/score/Clef";
import TimeSignature from "@/core/music/score/TimeSignature";
import KeySignature from "@/core/music/score/KeySignature";

export default function PalettePanel() {
  const { score, updateScore, selection } = useScore();

  const [anchorClef, setAnchorClef] = React.useState(null);
  const [anchorTime, setAnchorTime] = React.useState(null);
  const [anchorKey, setAnchorKey] = React.useState(null);
  const [anchorArtic, setAnchorArtic] = React.useState(null);

  const selected = selection.selected;

  // -------------------------
  // APPLY CLEF
  // -------------------------
  const applyClef = (clefName) => {
    updateScore(s => {
      s.clef = new Clef(clefName);
    });
    setAnchorClef(null);
  };

  // -------------------------
  // APPLY TIME SIGNATURE
  // -------------------------
  const applyTime = (num, den) => {
    updateScore(s => {
      s.timeSignature = new TimeSignature(num, den);
    });
    setAnchorTime(null);
  };

  // -------------------------
  // APPLY KEY SIGNATURE
  // -------------------------
  const applyKey = (key) => {
    updateScore(s => {
      s.keySignature = new KeySignature(key);
    });
    setAnchorKey(null);
  };

  // -------------------------
  // APPLY ARTICULATION to selected note
  // -------------------------
  const applyArticulation = (type) => {
    if (!selected || !selected.pitch) {
      setAnchorArtic(null);
      return;
    }

    updateScore(s => {
      selected.articulations = selected.articulations || [];
      selected.articulations.push(type);
    });

    setAnchorArtic(null);
  };

  return (
    <Box
      sx={{
        width: 200,
        borderRight: "1px solid #ddd",
        p: 2,
        background: "#fafafa",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Palette
      </Typography>

      {/* CLEF BUTTON */}
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

      {/* TIME SIGNATURE */}
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

      {/* KEY SIGNATURE */}
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
        {/* Sharps */}
        <MenuItem onClick={() => applyKey("C")}>C major / A minor</MenuItem>
        <MenuItem onClick={() => applyKey("G")}>G major / E minor</MenuItem>
        <MenuItem onClick={() => applyKey("D")}>D major / B minor</MenuItem>
        <MenuItem onClick={() => applyKey("A")}>A major / F#m</MenuItem>
        <MenuItem onClick={() => applyKey("E")}>E major / C#m</MenuItem>

        {/* Flats */}
        <MenuItem onClick={() => applyKey("F")}>F major / Dm</MenuItem>
        <MenuItem onClick={() => applyKey("Bb")}>Bb major / Gm</MenuItem>
        <MenuItem onClick={() => applyKey("Eb")}>Eb major / Cm</MenuItem>
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
