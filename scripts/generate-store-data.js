
import fs from 'fs-extra';
import path from 'path';
import guitar from '../config/guitar.js';

const PRODUCTS_FILE = './data/products.json';

async function generateProducts() {
    const products = [];
    const individualSheets = [];
    const bundles = [];
    const keys = guitar.notes.sharps;

    const entities = [
        { id: 'chords', label: 'Chords', subDir: 'chords' },
        { id: 'arppegios', label: 'Arpeggios', subDir: 'arppegios' },
        { id: 'scales', label: 'Scales', subDir: 'scales' }
    ];

    // 1. Master Spreading Bundle ($100)
    bundles.push({
        id: 'master-spreading-bundle',
        title: 'The Ultimate Spreading Collection',
        price: 100.0,
        type: 'Digital',
        category: 'Guitar Sheets Bundles',
        image: '/screens/scales/C/major/single.png',
        description: 'The entire library of interactive sheet music. All keys, all chords, all arpeggios, and all scales. The ultimate resource for the modern guitarist.'
    });

    keys.forEach(key => {
        entities.forEach(entity => {
            // 2. Key-Entity Bundles ($5 each)
            bundles.push({
                id: `bundle-${key.replace('#', 'sharp')}-${entity.id}`,
                title: `Bundle: All ${key} ${entity.label}`,
                price: 5.0,
                type: 'Digital',
                category: 'Guitar Sheets Bundles',
                musicType: entity.label.slice(0, -1),
                musicKey: key,
                image: `/screens/${entity.subDir}/${key.replace('#', 'sharp')}/major.png` || `/screens/${entity.subDir}/${key.replace('#', 'sharp')}/M.png`,
                description: `Get the complete collection of all ${entity.label} in the key of ${key}. Great value!`
            });

            const items = entity.id === 'scales' ? Object.keys(guitar.scales) : Object.keys(guitar.arppegios);

            items.forEach(itemKey => {
                const item = entity.id === 'scales' ? guitar.scales[itemKey] : guitar.arppegios[itemKey];
                const itemName = item.name || itemKey;

                if (entity.id === 'scales') {
                    if (item.isModal) {
                        item.modes.forEach(mode => {
                            const modeName = mode.name.toLowerCase().replace(/ /g, '-').replace('#', 'sharp');
                            const slug = `${key.replace('#', 'sharp')}-${itemKey}-${modeName}`;

                            individualSheets.push({
                                id: `sheet-${slug}`,
                                title: `Sheet: ${key} ${mode.name} (${item.name})`,
                                price: 1.0,
                                type: 'Digital',
                                category: 'Guitar Fretboard Sheets',
                                musicType: 'Scale',
                                musicKey: key,
                                image: `/screens/scales/${key.replace('#', 'sharp')}/${itemKey}/modal/${modeName}.png`,
                                pdf: `/pdf-pages/scales/${key.replace('#', 'sharp')}/${itemKey}/modal/${modeName}.pdf`,
                                description: `High-quality interactive sheet music for ${key} ${mode.name} scale. Includes PNG and PDF.`
                            });
                        });
                    } else {
                        const slug = `${key.replace('#', 'sharp')}-${itemKey}-single`;
                        individualSheets.push({
                            id: `sheet-${slug}`,
                            title: `Sheet: ${key} ${itemName}`,
                            price: 1.0,
                            type: 'Digital',
                            category: 'Guitar Fretboard Sheets',
                            musicType: 'Scale',
                            musicKey: key,
                            image: `/screens/scales/${key.replace('#', 'sharp')}/${itemKey}/single.png`,
                            pdf: `/pdf-pages/scales/${key.replace('#', 'sharp')}/${itemKey}/single.pdf`,
                            description: `High-quality interactive sheet music for ${key} ${itemName}. Includes PNG and PDF.`
                        });
                    }
                } else {
                    const slug = `${key.replace('#', 'sharp')}-${itemKey}`;
                    individualSheets.push({
                        id: `sheet-${slug}`,
                        title: `Sheet: ${key} ${itemName} ${entity.label.slice(0, -1)}`,
                        price: 1.0,
                        type: 'Digital',
                        musicType: entity.label.slice(0, -1),
                        musicKey: key,
                        category: 'Guitar Fretboard Sheets',
                        image: `/screens/${entity.subDir}/${key.replace('#', 'sharp')}/${itemKey.replace('#', 'sharp')}.png`,
                        pdf: `/pdf-pages/${entity.subDir}/${key.replace('#', 'sharp')}/${itemKey.replace('#', 'sharp')}.pdf`,
                        description: `High-quality interactive sheet music for ${key} ${itemName} ${entity.label.slice(0, -1)}. Includes PNG and PDF.`
                    });
                }
            });
        });
    });

    // Combine: Bundles first, then individual sheets
    const allProducts = [...bundles, ...individualSheets];

    await fs.ensureDir(path.dirname(PRODUCTS_FILE));
    await fs.writeJson(PRODUCTS_FILE, allProducts, { spaces: 4 });
    console.log(`Successfully generated ${allProducts.length} products to ${PRODUCTS_FILE}`);
}

generateProducts().catch(console.error);
