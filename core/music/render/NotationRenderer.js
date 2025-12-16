import Vex from "vexflow";
const VF = Vex;

function attachInteraction(vfNote, dawNote, selection) {
  const el = vfNote.getSVGElement?.();
  if (!el) return;

  el.style.cursor = "pointer";
  el.addEventListener("click", e => {
    e.stopPropagation();
    selection.select(dawNote);
  });
}

export default class NotationRenderer {
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
    const SYSTEM_HEIGHT = 120;
    const START_X = 20;

    let x = START_X;
    let y = 40;

    this.score.measures.forEach((measure, index) => {
      if (index % MEASURES_PER_LINE === 0 && index !== 0) {
        x = START_X;
        y += SYSTEM_HEIGHT;
      }

      const stave = new VF.Stave(x, y, MEASURE_WIDTH);

      if (index === 0) {
        stave
          .addClef(this.score.clef?.name || "treble")
          .addTimeSignature(this.score.timeSignature.toString())
          .addKeySignature(this.score.keySignature.key);
      }

      stave.setContext(ctx).draw();

      const voices = [];

      measure.voices.forEach(voice => {
        if (!voice.elements.length) return;

        const notes = [];

        voice.elements.forEach(entry => {
          const n = entry.note ?? entry;
          if (!n) return;

          let vfNote;
          const dur = n.duration?.symbol || "q";

          if (n.isRest) {
            vfNote = new VF.StaveNote({ keys: ["b/4"], duration: dur + "r" });
          } else {
            const key = `${n.pitch.step.toLowerCase()}${
              n.pitch.alter === 1 ? "#" : n.pitch.alter === -1 ? "b" : ""
            }/${n.pitch.octave}`;

            vfNote = new VF.StaveNote({ keys: [key], duration: dur });
            attachInteraction(vfNote, n, this.selection);
          }

          notes.push(vfNote);
        });

        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        vfVoice.setMode(VF.Voice.Mode.SOFT);
        vfVoice.addTickables(notes);
        voices.push(vfVoice);
      });

      if (voices.length) {
        new VF.Formatter().joinVoices(voices).format(voices, MEASURE_WIDTH - 20);
        voices.forEach(v => v.draw(ctx, stave));
      }

      x += MEASURE_WIDTH;
    });
  }
}
