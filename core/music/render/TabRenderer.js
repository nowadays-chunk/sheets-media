// core/music/render/TabRenderer.js
import { Renderer, TabStave, TabNote } from "vexflow";

export default class TabRenderer {
  constructor() {}

  render() {
    if (!this.container || !this.score) return;

    // Reset container
    this.container.innerHTML = "";

    const renderer = new Renderer(this.container, Renderer.Backends.SVG);
    renderer.resize(800, 200);
    const context = renderer.getContext();

    const stave = new TabStave(10, 40, 780);
    stave.addTabGlyph();
    stave.setContext(context).draw();

    // -----------------------------------------
    // FIX: Declare notes array BEFORE the loops
    // -----------------------------------------
    const notes = [];

    // Convert score ➜ tab notes
    for (const measure of this.score.measures) {
      for (const voice of measure.voices) {
        voice.elements.forEach((entry) => {
          // Normalize the structure
          const element = entry?.element || entry?.data || entry;

          if (!element) return;

          // Default values
          let str = 3;
          let fret = 0;
          const dur = element.duration?.toVexflow?.() ?? "q";

          // Rest
          if (element.type === "rest" || element.isRest) {
            notes.push(

              new TabNote([{ str, fret }], dur)
            );
            return;
          }

          // Missing pitch → safe fallback
          if (!element.pitch) {
            notes.push(
              new TabNote([{ str, fret: 0 }], dur)
            );
            return;
          }

          // Pitch → naive conversion
          const midi = element.pitch.toMidi
            ? element.pitch.toMidi()
            : element.pitch.octave * 12;

          fret = midi % 12;
          str = 1;

          notes.push(
            new TabNote([{ str, fret }], dur)
          );
        });
      }
    }

    // VexFlow requires voice + formatter
    const voice = new TabVoice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], 700);

    notes.forEach((n) => n.setContext(context));
    notes.forEach((n) => n.draw());
  }
}
