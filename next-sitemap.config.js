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

    return result;
  },
};
