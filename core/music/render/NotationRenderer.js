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

    const MEASURES_PER_LINE = Infinity;
    const MEASURE_WIDTH = 250; // Increased for better spacing
    const SYSTEM_HEIGHT = 150;
    const START_X = 20;

    // Calculate total width needed
    const totalWidth = START_X + (MEASURE_WIDTH * this.score.measures.length) + 100;
    renderer.resize(totalWidth, 200); // Fixed height for single system

    let x = START_X;
    let y = 40;

    this.score.measures.forEach((measure, index) => {
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

        // GROUP NOTES BY BEAT (CHORDS)
        const beatGroups = new Map();
        voice.elements.forEach(entry => {
          const beat = entry.beat; // Assuming entry is { beat, note }
          if (!beatGroups.has(beat)) beatGroups.set(beat, []);
          beatGroups.get(beat).push(entry.note);
        });

        // Sort by beat position
        const sortedBeats = Array.from(beatGroups.keys()).sort((a, b) => a - b);

        const notes = [];

        sortedBeats.forEach(beat => {
          const group = beatGroups.get(beat);
          if (!group || group.length === 0) return;

          // Use properties of the first note for the chord (duration, type)
          // For a robust implementation, verify all notes match duration.
          const mainNote = group[0];
          const dur = mainNote.duration?.symbol || "q";

          let vfNote;

          if (mainNote.isRest) {
            vfNote = new VF.StaveNote({ keys: ["b/4"], duration: dur + "r" });
          } else {
            const keys = group.map(n => {
              return `${n.pitch.step.toLowerCase()}${n.pitch.alter === 1 ? "#" : n.pitch.alter === -1 ? "b" : n.pitch.alter === 2 ? "##" : n.pitch.alter === -2 ? "bb" : ""
                }/${n.pitch.octave}`;
            });

            vfNote = new VF.StaveNote({ keys: keys, duration: dur });

            // Attach interaction to the first note (temporary limitation)
            attachInteraction(vfNote, mainNote, this.selection);
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
