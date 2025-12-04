// core/music/score/Pitch.js
export default class Pitch {
  constructor(step = "C", alter = 0, octave = 4) {
    this.step = step;    // "C", "D", "E", ...
    this.alter = alter;  // -1, 0, +1
    this.octave = octave;
  }

  serialize() {
    return {
      step: this.step,
      alter: this.alter,
      octave: this.octave,
    };
  }

  static deserialize(json) {
    if (!json) return new Pitch();
    return new Pitch(json.step, json.alter, json.octave);
  }

  clone() {
    return new Pitch(this.step, this.alter, this.octave);
  }
}
