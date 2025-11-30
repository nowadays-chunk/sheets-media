// ===================================
// MidiSearch.jsx
// ===================================

import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import axios from "axios";
import { TextField, List, ListItem, ListItemButton } from "@mui/material";

const MIDI_REPO_LIST = "https://raw.githubusercontent.com/skylerbunny/midi-music-database/master/"; 
// This JSON must contain: [ { "name": "Song A", "url": "..." }, ... ]

const MidiSearch = ({ onSongSelected }) => {
  const [midiList, setMidiList] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function loadList() {
      const res = await axios.get(MIDI_REPO_LIST);
      setMidiList(res.data);
      setFiltered(res.data);
    }
    loadList();
  }, []);

  // Fuse.js search engine
  const fuse = new Fuse(midiList, {
    keys: ["name"],
    threshold: 0.3,
  });

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFiltered(midiList);
      return;
    }

    const results = fuse.search(value);
    setFiltered(results.map((r) => r.item));
  };

  return (
    <div>
      <TextField
        label="Search MIDI Songs"
        value={search}
        onChange={onSearchChange}
        fullWidth
        style={{ marginBottom: 20 }}
      />

      <List>
        {filtered.map((song, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton onClick={() => onSongSelected(song)}>
              {song.name}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MidiSearch;
