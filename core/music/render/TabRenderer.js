// core/music/render/NotationRenderer.js
import Vex from "vexflow";
const VF = Vex;

export default class TabRenderer {
  constructor({ container, score }) {
    this.container = container;
    this.score = score;
  }

  render() {
    if (!this.container || !this.score) return;
    this.container.innerHTML = "";

    const renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
    renderer.resize(800, 180);
    const ctx = renderer.getContext();

    const stave = new VF.TabStave(10, 30, 780);
    stave.addTabGlyph();
    stave.setContext(ctx).draw();

    const notes = [];

    for (const m of this.score.measures) {
      for (const v of m.voices) {
        v.elements.forEach(entry => {
          const el = entry.note ?? entry.element ?? entry;
          if (!el) return;

          const duration = el.duration?.symbol ?? "q";

          const tabNote = new VF.TabNote({
            positions: [{ str: el.string || 1, fret: el.fret || 0 }],
            duration
          });

          notes.push(tabNote);
        });
      }
    }

    if (notes.length === 0) return;

    const voice = new VF.Voice({
      num_beats: this.score.timeSignature?.beats ?? 4,
      beat_value: this.score.timeSignature?.beatValue ?? 4,
    });

    voice.setMode(VF.Voice.Mode.SOFT); // IMPORTANT for incomplete bars
    voice.addTickables(notes);

    new VF.Formatter().joinVoices([voice]).format([voice], 700);

    voice.draw(ctx, stave);
  }
}
