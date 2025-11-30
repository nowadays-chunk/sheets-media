// ===================================
// MidiLearningPage.jsx
// ===================================

import React, { useState } from "react";
import MidiSearch from "./MidiSearch";
import MidiPlayer from "./MidiPlayer";
import FretboardDisplay from "../Pages/Fretboard/FretboardDisplay"; // your component

const MidiLearningPage = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [highlight, setHighlight] = useState(null);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>

      <h2>MIDI Song Learning</h2>

      {/* Search + Suggestions */}
      <MidiSearch onSongSelected={setSelectedSong} />

      {/* MIDI Player */}
      {selectedSong && (
        <MidiPlayer
          midiUrl={selectedSong.url}
          onMappedFretboardEvent={(ev) => setHighlight(ev)}
        />
      )}

      {/* Fretboard live highlight */}
      {highlight && (
        <FretboardDisplay
          externalHighlight={highlight}
        />
      )}

    </div>
  );
};

export default MidiLearningPage;
