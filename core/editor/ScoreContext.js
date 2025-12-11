// core/editor/ScoreContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import Score from "@/core/music/score/Score";
import Note from "@/core/music/score/Note";
import Duration from "@/core/music/score/Duration";
import Pitch from "@/core/music/score/Pitch";

import UndoManager from "./UndoManager";
import SelectionManager from "./SelectionManager";
import NoteInputManager from "./NoteInputManager";

import TimeSignature from "@/core/music/score/TimeSignature";
import KeySignature from "@/core/music/score/KeySignature";
import Clef from "@/core/music/score/Clef";

import PlaybackEngine from "@/core/music/playback/PlaybackEngine";

export const ScoreContext = createContext(null);

export function ScoreProvider({ children }) {
  const [score, setScore] = useState(null);
  const [cursorBeat, setCursorBeat] = useState(0);

  const undo = useRef(new UndoManager());
  const selection = useRef(new SelectionManager());
  const input = useRef(new NoteInputManager());

  const playback = useRef(null);

  // Initialize score
  useEffect(() => {
    if (!score) {
      const s = new Score({
        title: "Untitled",
        composer: "Anonymous",
        timeSignature: new TimeSignature(4, 4),
        keySignature: new KeySignature("C"),
        clef: new Clef("treble")
      });

      s.addMeasure();
      setScore(s);
    }
  }, []);

  // Init audio
  useEffect(() => {
    const init = () => {
      if (!playback.current) {
        playback.current = new PlaybackEngine();
      }
    };

    window.addEventListener("click", init, { once: true });
    return () => window.removeEventListener("click", init);
  }, []);

  // Safe score update with undo snapshot
  const updateScore = (mutator) => {
    if (!score) return;

    undo.current.snapshot(score);

    setScore(prev => {
      const next = prev.clone();
      mutator(next);
      return next;
    });
  };

  // Called by fretboard DAW
  const addNoteFromFretboard = (event) => {
    if (!score || !event) return;
    if (event.type !== "note" || !event.pitch) return;

    const p = event.pitch;

    const pitch = new Pitch(
      p.step.toUpperCase(),
      p.accidental === "#" ? 1 : p.accidental === "b" ? -1 : 0,
      p.octave
    );

    const duration = new Duration("q", 1); // ALWAYS 1 beat quarter

    const note = new Note(pitch, duration);

    note.midi = p.midi;
    note.velocity = event.velocity ?? 0.9;

    // Guitar metadata
    note.fret = event.guitar?.fret ?? 0;
    note.string = event.guitar?.string ?? 1;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });

    setCursorBeat(c => c + 1);
  };

  return (
    <ScoreContext.Provider
      value={{
        score,
        updateScore,
        cursorBeat,
        setCursorBeat,
        undo: undo.current,
        selection: selection.current,
        input: input.current,
        playback: playback.current,
        addNoteFromFretboard,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export const useScore = () => useContext(ScoreContext);
