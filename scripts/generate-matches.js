const fs = require('fs');
const path = require('path');

// Mocking required structure for the script
const guitarPath = path.join(__dirname, '..', 'config', 'guitar.js');

// Helper to load ES6 export as a string and parse it roughly
let content = fs.readFileSync(guitarPath, 'utf8');
const dataStr = content.replace('export default ', '').replace(/;$/, '');
// Note: eval is dangerous but here we are in a controlled local script to process a config file
const guitar = eval(`(${dataStr})`);

function getSemitones(interval) {
    const map = {
        '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4, '4': 5, '#4': 6, 'b5': 6, '5': 7, '#5': 8, 'b6': 8, '6': 9, 'bb7': 9, 'b7': 10, '7': 11,
        'b9': 1, '9': 2, '#9': 3, 'b11': 4, '11': 5, '#11': 6, 'b13': 8, '13': 9
    };
    return map[interval];
}

function getIntervalSet(intervals) {
    return new Set(intervals.map(getSemitones));
}

const allScales = [];
// Flatten all modes into a single list of scales
for (const [key, scale] of Object.entries(guitar.scales)) {
    if (scale.modes) {
        scale.modes.forEach(mode => {
            allScales.push({
                name: mode.name,
                intervals: mode.intervals,
                semitones: getIntervalSet(mode.intervals)
            });
        });
    } else {
        allScales.push({
            name: scale.name,
            intervals: scale.intervals,
            semitones: getIntervalSet(scale.intervals)
        });
    }
}

const allArpeggios = [];
for (const [key, arpeggio] of Object.entries(guitar.arppegios)) {
    allArpeggios.push({
        id: key,
        name: arpeggio.name,
        intervals: arpeggio.intervals,
        semitones: getIntervalSet(arpeggio.intervals)
    });
}

// Generate matches
for (const arpeggioKey in guitar.arppegios) {
    const arpeggio = guitar.arppegios[arpeggioKey];
    const arpeggioSemitones = getIntervalSet(arpeggio.intervals);

    // Matching Scales: Scale must contain all notes of the arpeggio
    const matchingScales = allScales
        .filter(scale => [...arpeggioSemitones].every(s => scale.semitones.has(s)))
        .map(scale => scale.name);

    // Matching Arpeggios: Arpeggio B matches Arpeggio A if Arpeggio B notes are within Arpeggio A's scales
    // AND Arpeggio B is not the same as Arpeggio A (though maybe it should be included?)
    // Actually, usually "matching arpeggios" means arpeggios you can use for substitution.
    // Let's stick to arpeggios where all notes of Arpeggio B are in at least ONE of Arpeggio A's matching scales.
    const matchingArpNames = allArpeggios
        .filter(otherArp => [...otherArp.semitones].every(s => {
            // Must be contained in at least one of the matching scales
            return allScales
                .filter(scale => matchingScales.includes(scale.name))
                .some(scale => scale.semitones.has(s));
        }))
        .map(otherArp => otherArp.name);

    guitar.arppegios[arpeggioKey].matchingScales = matchingScales;
    guitar.arppegios[arpeggioKey].matchingArpeggios = matchingArpNames;
}

// Re-write the file
// This is a bit tricky because we want to preserve the JS structure but we have a JS object.
// We'll use JSON.stringify and then clean it up to look like the original as much as possible,
// or better yet, just replace the arppegios section.

const updatedArppegios = JSON.stringify(guitar.arppegios, null, 2);
// Use regex to replace the old arppegios object with the new one
const newContent = content.replace(/"arppegios": \{[\s\S]*?\n  \}/, `"arppegios": ${updatedArppegios}`);

fs.writeFileSync(guitarPath, newContent);
console.log('Generated matchingScales and matchingArpeggios for all arpeggios.');
