// core/music/render/NotationRenderer.js
import Vex from "vexflow";
const VF = Vex;

import { createVexNote, createVexRest } from "./VexflowExtensions.js";

export default class NotationRenderer {
  constructor({ container, score, layout = {} }) {
    this.container = container;
    this.score = score;
    this.layout = layout;
  }

  destroy() {
    if (this.container) this.container.innerHTML = "";
  }

  render() {
    if (!this.container || !this.score) return;

    this.destroy();

    const renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
    renderer.resize(900, 250);
    const context = renderer.getContext();

    const stave = new VF.Stave(10, 40, 860);

    // clef
    stave.addClef(this.score.clef?.name || "treble");

    // time signature
    if (this.score.timeSignature)
      stave.addTimeSignature(this.score.timeSignature.toString());

    // key signature
    if (this.score.keySignature)
      stave.addKeySignature(this.score.keySignature.key);

    stave.setContext(context).draw();

    // --------------------------------------
    // Build VexFlow voices
    // --------------------------------------
    const vfVoices = [];

    for (const measure of this.score.measures) {
      for (const voice of measure.voices) {
        if (!voice.elements || voice.elements.length === 0) continue;

        const tickables = [];

        for (const entry of voice.elements) {
          const n = entry.note ?? entry.element ?? entry.data ?? null;
          if (!n) continue;

          if (n.isRest) tickables.push(createVexRest(n));
          else tickables.push(createVexNote(n));
        }

        if (tickables.length === 0) continue;

        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        // ❗ VEXFLOW 4 FEATURE — SOFT MODE  
        // Accepts incomplete measures WITHOUT throwing errors
        vfVoice.setMode(VF.Voice.Mode.SOFT);

        vfVoice.addTickables(tickables);
        vfVoices.push(vfVoice);
      }
    }

    if (vfVoices.length === 0) return;

    // --------------------------------------
    // Format & Draw without errors
    // --------------------------------------
    const formatter = new VF.Formatter();
    formatter.joinVoices(vfVoices);
    formatter.format(vfVoices, 700);

    vfVoices.forEach(v => v.draw(context, stave));
  }
}