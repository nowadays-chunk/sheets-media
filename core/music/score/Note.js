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

    this.midi = null;
    this.velocity = 1;
    this.id = Math.random().toString(36).substr(2, 9);

    // Techniques
    this.technique = null; // "slide", "bend", "hammer", "pull"
    this.bend = null;      // if technique is bend
  }

  serialize() {
    return {
      id: this.id,
      pitch: this.pitch?.serialize() || null,
      duration: this.duration?.serialize() || null,
      isRest: this.isRest,

      string: this.string,
      fret: this.fret,
      technique: this.technique,
      bend: this.bend,

      midi: this.midi,
      velocity: this.velocity
    };
  }

  static deserialize(json) {
    const n = new Note(
      Pitch.deserialize(json.pitch),
      Duration.deserialize(json.duration)
    );
    if (json.id) n.id = json.id;

    n.isRest = json.isRest;

    n.string = json.string ?? null;
    n.fret = json.fret ?? null;
    n.technique = json.technique ?? null;
    n.bend = json.bend ?? null;

    n.midi = json.midi ?? null;
    n.velocity = json.velocity ?? 1;

    return n;
  }
}
