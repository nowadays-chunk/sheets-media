// core/music/render/NotationRenderer.js
import { VF, createStave, createVexNote, createVexRest } from "./VexflowExtensions.js";
import BeamEngine from "./BeamEngine.js";
import TieEngine from "./TieEngine.js";
import TupletEngine from "./TupletEngine.js";

export default class NotationRenderer {
  constructor({ container, score, layout }) {
    this.container = container;
    this.score = score;
    this.layout = layout;

    container.innerHTML = "";

    this.renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    this.context = this.renderer.getContext();
  }

  render() {
    const width = 900;
    const height = this.score.measures.length * 180;
    this.renderer.resize(width, height);

    let yOffset = 20;

    this.score.measures.forEach((measure, i) => {
      const stave = createStave({
        x: 20,
        y: yOffset,
        width: 850,
        clef: this.score.clef,
        timeSignature: measure.timeSignature,
        keySignature: this.score.keySignature,
      });

      stave.setContext(this.context).draw();

      // Convert score → vexflow tickables
      let tickables = [];

      measure.voices.forEach((voice) => {
        voice.elements.forEach((el) => {
          tickables.push(el.pitch ? createVexNote(el) : createVexRest(el));
        });
      });

      // Format
      const formatter = new VF.Formatter();
      formatter.joinVoices([new VF.Voice({
        num_beats: measure.timeSignature.beats,
        beat_value: measure.timeSignature.beatValue,
      }).addTickables(tickables)]);
      formatter.formatToStave(tickables, stave);

      // Draw notes
      tickables.forEach((t) => t.setContext(this.context).draw());

      // Beams
      BeamEngine.renderBeams(this.context, tickables);

      // Tuplets
      TupletEngine.renderTuplets(this.context, tickables);

      // Ties
      TieEngine.renderTies(this.context, measure.voices, tickables);

      yOffset += 160;
    });
  }
}
