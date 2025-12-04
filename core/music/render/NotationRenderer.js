// core/music/render/NotationRenderer.js
import { Renderer, Stave, StaveNote } from "vexflow";

export default class NotationRenderer {
  constructor() {}

  render() {
    if (!this.container || !this.score) return;

    // Clear container
    this.container.innerHTML = "";

    // VexFlow setup
    const renderer = new Renderer(this.container, Renderer.Backends.SVG);
    renderer.resize(800, 200);
    const context = renderer.getContext();

    // Create stave
    const stave = new Stave(10, 40, 780);
    stave.addClef("treble");
    stave.addTimeSignature(this.score.timeSignature.toString());
    stave.setContext(context).draw();

    const vfNotes = [];

    // Convert Score → VexFlow notes
    for (const measure of this.score.measures) {
      for (const voice of measure.voices) {
        for (const entry of voice.elements) {
          const element = entry.element || entry.data || entry;

          // Skip invalid
          if (!element) continue;

          // Rest
          if (element.isRest || element.type === "rest") {
            vfNotes.push(
              new StaveNote({
                clef: "treble",
                keys: ["b/4"],
                duration: element.duration?.symbol ?? "qr",
              })
            );
            continue;
          }

          // Note missing pitch → skip
          if (!element.pitch) continue;

          const key = `${element.pitch.step.toLowerCase()}${
            element.pitch.alter === 1 ? "#" : ""
          }/${element.pitch.octave}`;

          const dur = element.duration?.toVexflow?.() ?? "q";

          vfNotes.push(
            new StaveNote({
              clef: "treble",
              keys: [key],
              duration: dur,
            })
          );
        }
      }
    }

    // VexFlow requires a voice
    const voice = new Voice({
      num_beats: vfNotes.length,
      beat_value: 4,
    });

    voice.addTickables(vfNotes);

    // MUST format before drawing
    new Formatter().joinVoices([voice]).format([voice], 700);

    // Draw
    voice.draw(context, stave);
  }

}
