// ===================================
// MidiPlayer.jsx
// ===================================

import React, { useState, useEffect, useRef } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { Button } from "@mui/material";
import guitar from "../../config/guitar"; // your full guitar config

const MidiPlayer = ({ midiUrl, onMappedFretboardEvent }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const midiDataRef = useRef(null);

  // Convert C#4 → semitone index
  const noteToIndex = (name) => {
    const letter = name.replace(/[0-9]/g, "");
    return guitar.notes.sharps.indexOf(letter);
  };

  // Map MIDI notes to GK fretboard positions
  const mapNoteToFret = (noteIndex, fretboard) => {
    const positions = [];
    fretboard.forEach((string, s) => {
      for (let f = 0; f < string.length; f++) {
        const candidate = (string[0] + f) % 12;
        if (candidate === noteIndex) {
          positions.push({ stringIndex: s, fretIndex: f });
        }
      }
    });
    return positions[0] || null;
  };

  // Load MIDI file
  useEffect(() => {
    async function loadMidi() {
      if (!midiUrl) return;

      const res = await fetch(midiUrl);
      const arrayBuffer = await res.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      midiDataRef.current = midi;
      setIsLoaded(true);
    }

    loadMidi();
  }, [midiUrl]);

  const play = async () => {
    if (!midiDataRef.current) return;

    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel(0);

    const midi = midiDataRef.current;

    midi.tracks.forEach((track) => {
      track.notes.forEach((n) => {
        const noteIndex = noteToIndex(n.name);

        Tone.Transport.schedule((time) => {
          // Tell React the mapped fretboard location
          onMappedFretboardEvent({
            name: n.name,
            stringFret: mapNoteToFret(noteIndex, guitar.fretboard),
          });

          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease(n.name, n.duration, time);

        }, n.time);
      });
    });

    Tone.Transport.start();

    setIsPlaying(true);
  };

  const pause = () => {
    Tone.Transport.pause();
    setIsPlaying(false);
  };

  const restart = () => {
    Tone.Transport.stop();
    Tone.Transport.start();
    setIsPlaying(true);
  };

  return (
    <div style={{ marginTop: 20 }}>

      {!isLoaded && <div>Loading MIDI...</div>}

      {isLoaded && (
        <div style={{ display: "flex", gap: 20 }}>

          <Button variant="contained" onClick={play}>
            ▶ Play
          </Button>

          <Button variant="outlined" onClick={pause}>
            ⏸ Pause
          </Button>

          <Button variant="outlined" onClick={restart}>
            ⏮ Restart
          </Button>

        </div>
      )}
    </div>
  );
};

export default MidiPlayer;
