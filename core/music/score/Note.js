// core/music/score/Note.js
import Pitch from "./Pitch";
import Duration from "./Duration";

export default class Note {
  constructor(pitch = new Pitch(), duration = new Duration("q")) {
    this.pitch = pitch;
    this.duration = duration;
  }

  static fromFretboard(fretNote) {
    // fretNote = { string, fret, midi, noteName, octave, velocity }

    if (!fretNote) throw new Error("Invalid fretboard note input");

    // Extract pitch class (C, C#, D, etc.)
    const pitchClass = fretNote.noteName?.toUpperCase() ?? "C";

    let step = pitchClass[0];        // C, D, E, F, G, A, B
    let alter = pitchClass.includes("#") ? 1 : 0;
    let octave = fretNote.octave ?? 4;

    // Build Pitch object
    const pitch = new Pitch(step, alter, octave);

    // Duration default = quarter
    const dur = new Duration("q");

    // Create Note instance
    const n = new Note(pitch, dur);

    // Optional expression data from fretboard
    n.velocity = fretNote.velocity ?? 0.8;
    n.string = fretNote.string ?? null;
    n.fret = fretNote.fret ?? null;
    n.midi = fretNote.midi ?? pitch.toMidi();

    return n;
  }

  serialize() {
    return {
      pitch: this.pitch.serialize(),
      duration: this.duration.serialize(),
    };
  }

  static deserialize(json) {
    return new Note(
      Pitch.deserialize(json.pitch),
      Duration.deserialize(json.duration)
    );
  }

  clone() {
    return new Note(this.pitch.clone(), this.duration.clone());
  }
}
