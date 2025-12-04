// core/music/score/Note.js
import Pitch from "./Pitch";
import Duration from "./Duration";

export default class Note {
  constructor(pitch = new Pitch(), duration = new Duration("q")) {
    this.pitch = pitch;
    this.duration = duration;
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
