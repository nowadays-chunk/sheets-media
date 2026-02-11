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
import Pitch from "@/core/music/score/Pitch";
import Note from "@/core/music/score/Note";
import Duration from "@/core/music/score/Duration";

export default function Toolbar() {
  const { input, selection, updateScore, cursorBeat, setCursorBeat, insertNoteFromStringFret } = useScore();
  const [, forceUpdate] = useState({});
  // Quick Input State
  const [quickString, setQuickString] = useState(1);
  const [quickFret, setQuickFret] = useState(0);

  // Active duration state (starts with input's default)
  const [activeDuration, setActiveDuration] = useState(input.activeDuration?.symbol || "q");

  // Selection state
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Initial sync
    setSelected(selection.selected);
    // Subscribe
    return selection.subscribe(setSelected);
  }, [selection]);

  const insertNote = (step) => {
    const pitch = new Pitch(
      step,
      input.activeAccidental,
      4 // Default Octave
    );

    // Use active duration (or default quarter)
    const duration = input.activeDuration || new Duration("q");
    const note = new Note(pitch, duration);

    // Simple velocity default
    note.velocity = 0.9;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });
    setCursorBeat(c => c + 1);
  };

  const insertRest = () => {
    // Use active duration
    const duration = input.activeDuration || new Duration("q");
    // Pitch doesn't matter for rest but we need a valid note struct
    // Often B4 is used as a placeholder position or just 0
    const note = new Note(new Pitch("B", 0, 4), duration);
    note.isRest = true;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });
    setCursorBeat(c => c + 1);
  };

  const handleSetDuration = (val) => {
    setActiveDuration(val);
    input.setDuration(val);
  };

  const handleQuickInsert = () => {
    insertNoteFromStringFret(parseInt(quickString), parseInt(quickFret));
  };

  const applyTechnique = (technique) => {
    const s = selection.selected;
    if (!s) return;

    updateScore(draft => {
      // Find note in draft by ID
      for (const m of draft.measures) {
        for (const v of m.voices) {
          const el = v.elements.find(e => e.note.id === s.id);
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

  const dur = (q, label) => {
    // Check if this duration is active
    const isActive = activeDuration === q;
    // Check if selected note has this duration
    const isSelected = selected && selected.duration && selected.duration.symbol === q;

    // Determine color
    // If active: primary
    // If selected: secondary or error? Or just primary too?
    // User requested "add the same highlight".
    const color = (isActive || isSelected) ? "primary" : "default";

    return (
      <Tooltip title={`${q} note`}>
        <IconButton
          onClick={() => handleSetDuration(q)}
          color={color}
          sx={{
            fontSize: 14,
            fontWeight: 'bold',
            width: 36,
            height: 36,
            border: (isActive || isSelected) ? '2px solid' : '1px solid #eee',
            borderColor: (isActive || isSelected) ? 'primary.main' : '#eee'
          }}
        >
          {label}
        </IconButton>
      </Tooltip>
    );
  };

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

      {dur('w', 'W')} {dur('h', 'H')} {dur('q', 'Q')} {dur('8', '8')} {dur('16', '16')}

      <Tooltip title="Rest">
        <IconButton
          onClick={insertRest}
          sx={{
            fontSize: 14,
            fontWeight: 'bold',
            width: 36,
            height: 36,
            border: '1px solid #eee'
          }}
        >
          R
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {["C", "D", "E", "F", "G", "A", "B"].map(step => (
        <Tooltip title={`Insert ${step}`} key={step}>
          <IconButton
            onClick={() => insertNote(step)}
            sx={{
              width: 36,
              height: 36,
              fontSize: 14,
              fontWeight: 'bold',
              border: '1px solid #eee'
            }}
          >
            {step}
          </IconButton>
        </Tooltip>
      ))}

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

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* QUICK INPUT */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <input
          type="number"
          min="1" max="6"
          value={quickString}
          onChange={(e) => setQuickString(e.target.value)}
          style={{ width: 40, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
          placeholder="Str"
          title="String"
        />
        <input
          type="number"
          min="0" max="24"
          value={quickFret}
          onChange={(e) => setQuickFret(e.target.value)}
          style={{ width: 40, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
          placeholder="Fret"
          title="Fret"
        />
        <IconButton onClick={handleQuickInsert} color="primary" sx={{ border: '1px solid #eee', borderRadius: 1 }}>
          <Box sx={{ fontSize: 12, fontWeight: 'bold' }}>TAB</Box>
        </IconButton>
      </Box>
    </Box>
  );
}
