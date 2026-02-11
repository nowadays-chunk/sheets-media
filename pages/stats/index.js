// pages/stats.jsx
import guitar from "@/config/guitar";
import { processFretboard } from "@/config/fretboardProcessor";

import Stats from "@/components/Pages/Stats/Stats";

const FRET_COUNT = 25;

/* ------------------------------------------------------------
   SAFELY SERIALIZE (keeps your original behavior)
------------------------------------------------------------ */
function safeJSON(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      value === undefined ? null : value
    )
  );
}

/* ------------------------------------------------------------
   NEW: USAGE ANALYTICS (only addition)
------------------------------------------------------------ */
/* ------------------------------------------------------------
   GET STATIC PROPS — READ PRECOMPUTED STATS
------------------------------------------------------------ */
export async function getStaticProps() {
  const keys = guitar.notes.sharps.map((_, i) => i);
  const shapes = guitar.shapes.names;

  const chordNames = Object.keys(guitar.arppegios);
  const arpNames = Object.keys(guitar.arppegios);
  const scaleNames = Object.keys(guitar.scales);

  let chords = [];
  let arpeggios = [];
  let scales = [];

  /* -------- CHORDS -------- */
  keys.forEach((keyIndex) => {
    chordNames.forEach((chordName) => {
      shapes.forEach((shape) => {
        const fb = processFretboard({
          keyIndex,
          type: "chord",
          chordName,
          shape,
        });

        chords.push(
          safeJSON({
            keyIndex,
            chord: chordName,
            shape,
            fretboard: fb,
          })
        );
      });
    });
  });

  /* -------- ARPEGGIOS -------- */
  keys.forEach((keyIndex) => {
    arpNames.forEach((arpName) => {
      shapes.forEach((shape) => {
        const fb = processFretboard({
          keyIndex,
          type: "arppegio",
          arpName,
          shape,
        });

        arpeggios.push(
          safeJSON({
            keyIndex,
            arppegio: arpName,
            shape,
            fretboard: fb,
          })
        );
      });
    });
  });

  /* -------- SCALES -------- */
  keys.forEach((keyIndex) => {
    scaleNames.forEach((scaleName) => {
      const scale = guitar.scales[scaleName];

      if (scale.isModal && scale.modes) {
        scale.modes.forEach((_, modeIndex) => {
          shapes.forEach((shape) => {
            const fb = processFretboard({
              keyIndex,
              type: "scale",
              scaleName,
              shape,
              modeIndex,
            });

            scales.push(
              safeJSON({
                keyIndex,
                scale: scaleName,
                mode: modeIndex,
                shape,
                fretboard: fb,
              })
            );
          });
        });
      } else {
        shapes.forEach((shape) => {
          const fb = processFretboard({
            keyIndex,
            type: "scale",
            scaleName,
            shape,
            modeIndex: null, // explicit null
          });

          scales.push(
            safeJSON({
              keyIndex,
              scale: scaleName,
              mode: null,
              shape,
              fretboard: fb,
            })
          );
        });
      }
    });
  });

  /* -------- READ PRECOMPUTED STATS -------- */
  const fs = require('fs');
  const path = require('path');
  const statsDir = path.join(process.cwd(), 'data', 'stats');

  let usage = {};
  let precomputedStats = {};

  try {
    if (fs.existsSync(path.join(statsDir, 'usage.json'))) {
      usage = JSON.parse(fs.readFileSync(path.join(statsDir, 'usage.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(statsDir, 'chords.json'))) {
      precomputedStats.chords = JSON.parse(fs.readFileSync(path.join(statsDir, 'chords.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(statsDir, 'arpeggios.json'))) {
      precomputedStats.arpeggios = JSON.parse(fs.readFileSync(path.join(statsDir, 'arpeggios.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(statsDir, 'scales.json'))) {
      precomputedStats.scales = JSON.parse(fs.readFileSync(path.join(statsDir, 'scales.json'), 'utf8'));
    }
  } catch (error) {
    console.error("Error reading precomputed stats:", error);
  }

  return {
    props: {
      chords,
      arpeggios,
      scales,
      usage,
      precomputedStats,
    },
  };
}

export default Stats;
