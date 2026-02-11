// pages/stats.jsx
import Stats from "@/components/Pages/Stats/Stats";

/* ------------------------------------------------------------
   GET STATIC PROPS — READ PRECOMPUTED STATS
------------------------------------------------------------ */
export async function getStaticProps() {
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
      // Pass empty arrays so the component doesn't break if it expects them
      // (though it should rely on precomputedStats now)
      chords: [],
      arpeggios: [],
      scales: [],
      usage,
      precomputedStats,
    },
  };
}

export default Stats;
