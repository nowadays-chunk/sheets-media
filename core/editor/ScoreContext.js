// core/editor/ScoreContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import UndoManager from "./UndoManager";
import SelectionManager from "./SelectionManager";
import NoteInputManager from "./NoteInputManager";
import PlaybackEngine from "@/core/music/playback/PlaybackEngine";

// Your score engine classes:
import Score from "@/core/music/score/Score";
import Pitch from "@/core/music/score/Pitch";
import Note from "@/core/music/score/Note";
import Duration from "@/core/music/score/Duration";

export const ScoreContext = createContext(null);

export function ScoreProvider({ children }) {
  const [score, setScore] = useState(null);
  const [cursorBeat, setCursorBeat] = useState(0);

  const undo = useRef(new UndoManager());
  const selection = useRef(new SelectionManager());
  const input = useRef(new NoteInputManager());

  // Playback engine — instantiated ONLY on client
  const playback = useRef(null);


    // 1) Guarantee score is always a Score instance
  useEffect(() => {
    if (!(score instanceof Score)) {
      setScore(new Score());
    }
  }, [score]);

  // 2) updateScore must not run until score is ready
  const updateScore = (mutator) => {
    setScore((prev) => {
      // Prevent running on null or wrong object
      if (!(prev instanceof Score)) {
        console.warn("updateScore skipped: Score not initialized");
        return prev;
      }

      const next = prev.clone();  // created Score instance
      mutator(next);              // safe here
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !playback.current) {
      playback.current = new PlaybackEngine();
    }
  }, []);

  /* -------------------------------------------------------------
     HIGH-LEVEL API: ADD NOTE FROM FRETBOARD
  ------------------------------------------------------------- */

  const addNoteFromFretboard = (noteObj) => {
    if (!noteObj) return;

    // Create score on first use
    if (!score) {
      const s = new Score();
      setScore(s);
      // delay insert until score exists:
      requestAnimationFrame(() =>
        insertNoteIntoScore(noteObj, s, updateScore)
      );
      return;
    }

    insertNoteIntoScore(noteObj, score, updateScore);
  };

  /**
   * INTERNAL: insert note into the Score engine
   */
  const insertNoteIntoScore = (noteObj, currentScore, applyUpdate) => {
    const { noteName, octave } = noteObj;

    // Convert from "E" or "F#" into pitch class
    const step = noteName.replace("#", ""); // "F# → F"
    const alter = noteName.includes("#") ? 1 : 0;

    const pitch = new Pitch(step, alter, octave);

    const duration = new Duration("q"); // quarter note

    const newNote = new Note(pitch, duration);

    applyUpdate((draft) => {
      draft.addNote(cursorBeat, newNote);
    });

    // Move cursor forward
    setCursorBeat((b) => b + 1);
  };

  /* -------------------------------------------------------------
     PROVIDER VALUE
  ------------------------------------------------------------- */
  return (
    <ScoreContext.Provider
      value={{
        score,
        setScore,
        updateScore,
        cursorBeat,
        setCursorBeat,

        undo: undo.current,
        selection: selection.current,
        input: input.current,
        playback: playback.current,

        // ⭐ Newly added API
        addNoteFromFretboard,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export const useScore = () => useContext(ScoreContext);
