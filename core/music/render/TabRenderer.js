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
    const SYSTEM_HEIGHT = 150; // Increased for bends
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

      const vfConnectors = []; // Slides, Hammers, Pulls

      const voices = [];

      measure.voices.forEach(voice => {
        if (!voice.elements.length) return;

        // 1. Group by Beat
        const beatGroups = new Map();
        voice.elements.forEach(entry => {
          const beat = entry.beat;
          if (!beatGroups.has(beat)) beatGroups.set(beat, []);
          beatGroups.get(beat).push(entry.note);
        });

        const sortedBeats = Array.from(beatGroups.keys()).sort((a, b) => a - b);

        const vfNotes = [];
        const modelInfo = []; // { group, tabNote }

        // 2. Create Notes
        sortedBeats.forEach(beat => {
          const group = beatGroups.get(beat);
          if (!group || group.length === 0) return;

          const mainNote = group[0];
          const dur = mainNote.duration?.symbol || "q";

          let tabNote;

          if (mainNote.isRest) {
            // Tab rests are not clearly standard in VexFlow, usually just empty space or specific glyph
            // We'll calculate positions but use type "r" if possible?
            // TabNote doesn't easily support rest type like StaveNote usually.
            // VexFlow defines StaveNote({ type: "r" }).
            // For TabNote, we often skip or render ghost.
            // But for spacing we need a generic Note. 
            // We'll use a GhostNote or StaveNote if we want spacing without drawing.
            // But here we use Stave's voice.
            // Simpler: Use a TabNote with no positions?
            // Or use StaveNote with keys "b/4" type "r" but render on TabStave? No.
            // We can use `new VF.GhostNote({ duration: dur })` to take up space.
            tabNote = new VF.GhostNote({ duration: dur });
          } else {
            const positions = group.map(n => ({ str: n.string || 1, fret: n.fret || 0 }));
            tabNote = new VF.TabNote({
              positions: positions,
              duration: dur
            });

            // Bends (Modifiers)
            group.forEach((note, i) => {
              if (note.technique === 'bend') {
                tabNote.addModifier(new VF.Bend(note.bend || "Full"), i);
              }
              // Add text annotations for techniques that will be shown as connectors
              // This helps users see that the technique is applied even if there's no next note yet
              if (['slide', 'hammer', 'pull'].includes(note.technique)) {
                const techniqueLabels = {
                  'slide': 'sl.',
                  'hammer': 'H',
                  'pull': 'P'
                };
                const annotation = new VF.Annotation(techniqueLabels[note.technique]);
                annotation.setFont("Arial", 10, "italic");
                tabNote.addModifier(annotation, i);
              }
            });

            attachInteraction(tabNote, mainNote, this.selection);
          }

          vfNotes.push(tabNote);
          modelInfo.push({ group, tabNote });
        });

        // 3. Create Connectors (2nd pass)
        modelInfo.forEach((curr, index) => {
          if (index >= modelInfo.length - 1) return;
          const next = modelInfo[index + 1];

          // For each note in current chord, look for connecting note in next chord
          curr.group.forEach((note, i) => {
            if (['slide', 'hammer', 'pull'].includes(note.technique)) {
              // Find matching string in next
              const nextIndex = next.group.findIndex(n => n.string === note.string);
              if (nextIndex !== -1) {
                // Check VexFlow API for checking note types
                // Assuming separate connectors for Hammer/Pull/Slide

                let connector;
                const params = {
                  first_note: curr.tabNote,
                  last_note: next.tabNote,
                  first_indices: [i],
                  last_indices: [nextIndex],
                };

                if (note.technique === 'slide') {
                  connector = new VF.TabSlide(params);
                } else if (note.technique === 'hammer') {
                  connector = new VF.HammerOn(params);
                } else if (note.technique === 'pull') {
                  connector = new VF.PullOff(params);
                }

                if (connector) vfConnectors.push(connector);
              }
            }
          });
        });

        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        vfVoice.setMode(VF.Voice.Mode.SOFT);
        vfVoice.addTickables(vfNotes);
        voices.push(vfVoice);
      });

      if (voices.length) {
        new VF.Formatter().joinVoices(voices).format(voices, MEASURE_WIDTH - 20);
        voices.forEach(v => v.draw(ctx, stave));

        // Draw connectors
        vfConnectors.forEach(c => c.setContext(ctx).draw());
      }

      x += MEASURE_WIDTH;
    });
  }
}
