// core/music/render/TabRenderer.js
import { VF } from "./VexflowExtensions.js";

export default class TabRenderer {
  constructor({ container, score }) {
    this.container = container;
    this.score = score;

    container.innerHTML = "";
    this.renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    this.context = this.renderer.getContext();
  }

  render() {
    const width = 900;
    const height = this.score.measures.length * 160;
    this.renderer.resize(width, height);

    let yOffset = 20;

    this.score.measures.forEach((measure) => {
      const tabStave = new VF.TabStave(20, yOffset, 850);
      tabStave.addClef("tab").setContext(this.context).draw();

      const notes = [];

      measure.voices[0].elements.forEach((el) => {
        if (!el.pitch) return; // rests ignored for tab

        const tabNote = new VF.TabNote({
          positions: [{ str: el.string + 1, fret: el.fret }],
          duration: "q", // TODO: match notation duration exactly
        });

        notes.push(tabNote);
      });

      const voice = new VF.Voice({
        num_beats: measure.timeSignature.beats,
        beat_value: measure.timeSignature.beatValue,
      }).addTickables(notes);

      new VF.Formatter().joinVoices([voice]).format([voice], 800);

      voice.draw(this.context, tabStave);

      yOffset += 140;
    });
  }
}
