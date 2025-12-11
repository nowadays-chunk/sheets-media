// core/music/score/Note.js
import Pitch from "./Pitch";
import Duration from "./Duration";

export default class Note {
  constructor(pitch, duration) {
    this.pitch = pitch;
    this.duration = duration;
    this.isRest = false;

    // Guitar metadata
    this.string = null;
    this.fret = null;

    // Performance metadata
    this.midi = null;
    this.velocity = 1;
  }

  serialize() {
    return {
      pitch: this.pitch?.serialize() || null,
      duration: this.duration?.serialize() || null,
      isRest: this.isRest,

      string: this.string,
      fret: this.fret,

      midi: this.midi,
      velocity: this.velocity
    };
  }

  static deserialize(json) {
    const n = new Note(
      Pitch.deserialize(json.pitch),
      Duration.deserialize(json.duration)
    );

    n.isRest = json.isRest;

    n.string = json.string ?? null;
    n.fret = json.fret ?? null;

    n.midi = json.midi ?? null;
    n.velocity = json.velocity ?? 1;

    return n;
  }
}
