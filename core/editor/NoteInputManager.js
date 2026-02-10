// core/editor/NoteInputManager.js
import Duration from "@/core/music/score/Duration";

export default class NoteInputManager {
  constructor() {
    this.activeDuration = new Duration("q");
    this.override = false; // overwrite mode

    // Accidental selection (0 = natural, 1 = sharp, -1 = flat)
    this.activeAccidental = 0;

    // String/Fret input mode
    this.activeString = null;
    this.activeFret = null;
  }

  setDuration(q) {
    this.activeDuration = new Duration(q);
  }

  setAccidental(alter) {
    // Toggle: if same accidental clicked, set to natural
    this.activeAccidental = (this.activeAccidental === alter) ? 0 : alter;
  }

  setStringFret(string, fret) {
    this.activeString = string;
    this.activeFret = fret;
  }
}
