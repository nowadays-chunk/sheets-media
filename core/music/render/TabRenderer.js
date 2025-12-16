import Vex from "vexflow";
const VF = Vex;

function attachInteraction(tabNote, dawNote, selection) {
  const el = tabNote.getSVGElement?.();
  if (!el) return;

  el.style.cursor = "pointer";
  el.addEventListener("click", e => {
    e.stopPropagation();
    selection.select(dawNote);
  });
}

export default class TabRenderer {
  constructor({ container, score, selection }) {
    this.container = container;
    this.score = score;
    this.selection = selection;
  }

  render() {
    if (!this.container || !this.score) return;
    this.container.innerHTML = "";

    const renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
    renderer.resize(900, 1400);
    const ctx = renderer.getContext();

    const MEASURES_PER_LINE = 4;
    const MEASURE_WIDTH = 200;
    const SYSTEM_HEIGHT = 100;
    const START_X = 20;

    let x = START_X;
    let y = 40;

    this.score.measures.forEach((measure, index) => {
      if (index % MEASURES_PER_LINE === 0 && index !== 0) {
        x = START_X;
        y += SYSTEM_HEIGHT;
      }

      const stave = new VF.TabStave(x, y, MEASURE_WIDTH);
      if (index === 0) stave.addClef("tab");
      stave.setContext(ctx).draw();

      const notes = [];

      measure.voices.forEach(voice => {
        voice.elements.forEach(entry => {
          const n = entry.note ?? entry;
          if (!n) return;

          const tabNote = new VF.TabNote({
            positions: [{ str: n.string || 1, fret: n.fret || 0 }],
            duration: n.duration?.symbol || "q",
          });

          attachInteraction(tabNote, n, this.selection);
          notes.push(tabNote);
        });
      });

      if (notes.length) {
        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        vfVoice.setMode(VF.Voice.Mode.SOFT);
        vfVoice.addTickables(notes);

        new VF.Formatter().joinVoices([vfVoice]).format([vfVoice], MEASURE_WIDTH - 20);
        vfVoice.draw(ctx, stave);
      }

      x += MEASURE_WIDTH;
    });
  }
}
