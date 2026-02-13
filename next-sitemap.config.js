const fs = require('fs');
const path = require('path');

module.exports = {
  siteUrl: 'https://www.sheets.media',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const result = [];
    const guitar = require('./config/guitar').default;
    const products = require('./data/products.json');

    const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

    // 1. Songs (~30,000)
    const songsDir = path.join(process.cwd(), 'songs');
    if (fs.existsSync(songsDir)) {
      const songFiles = fs.readdirSync(songsDir);
      songFiles.forEach(file => {
        if (file.endsWith('.json')) {
          result.push({ loc: `/learn/${file.replace('.json', '')}` });
        }
      });
    }

    // 2. Products (~30)
    products.forEach(p => {
      result.push({ loc: `/product/${p.id}` });
    });

    // 3. Spreading (~1,500)
    guitar.notes.sharps.forEach(key => {
      const keySlug = slugify(key);

      // Scales
      Object.entries(guitar.scales).forEach(([scaleKey, scaleData]) => {
        const scaleSlug = slugify(scaleData.name);
        if (scaleData.modes) {
          scaleData.modes.forEach(mode => {
            const modeSlug = slugify(mode.name);
            result.push({ loc: `/spreading/scales/${keySlug}/${scaleSlug}/modal/${modeSlug}` });
          });
        }
        result.push({ loc: `/spreading/scales/${keySlug}/${scaleSlug}/single` });
      });

      // Chords
      Object.values(guitar.arppegios).forEach(arp => {
        const arpSlug = slugify(arp.name);
        result.push({ loc: `/spreading/chords/${keySlug}/${arpSlug}` });
      });

      // Arpeggios
      Object.values(guitar.arppegios).forEach(arp => {
        const arpSlug = slugify(arp.name);
        result.push({ loc: `/spreading/arppegios/${keySlug}/${arpSlug}` });
      });
    });

    // 4. Matches (Limited subset to avoid 700k+ URLs)
    // Common keys and core shapes for top-level matches
    const mainKeys = ['C', 'G', 'D', 'A', 'E', 'F'];
    const mainShapes = ['E', 'A', 'C'];
    const commonScales = ['major', 'minor', 'blues-minor'];
    const commonChords = ['M', 'min', '7', 'M7', 'min7'];

    mainKeys.forEach(key1 => {
      const key1Slug = slugify(key1);
      mainKeys.forEach(key2 => {
        const key2Slug = slugify(key2);
        mainShapes.forEach(shape => {
          const shapeSlug = shape.toLowerCase();

          commonScales.forEach(sKey => {
            const sData = guitar.scales[sKey];
            const sSlug = slugify(sData.name);
            commonChords.forEach(cKey => {
              const cData = guitar.arppegios[cKey];
              const cSlug = slugify(cData.name);
              // Format: [type]_[name]_in_[key1]_key_matches_chord_[name]_in_[key2]_key_and_[shape]_shape
              const matchSlug = `scale_${sSlug}_in_${key1Slug}_key_matches_chord_${cSlug}_in_${key2Slug}_key_and_${shapeSlug}_shape`;
              result.push({ loc: `/matches/${matchSlug}` });
            });
          });
        });
      });
    });

    return result;
  },
};
