// core/music/score/TimeSignature.js
export default class TimeSignature {
  constructor(beats = 4, beatValue = 4) {
    this.beats = beats;
    this.beatValue = beatValue;
  }

  serialize() {
    return {
      beats: this.beats,
      beatValue: this.beatValue,
    };
  }

  static deserialize(json) {
    if (!json) return new TimeSignature(4, 4);
    return new TimeSignature(json.beats, json.beatValue);
  }

  clone() {
    return new TimeSignature(this.beats, this.beatValue);
  }
}
