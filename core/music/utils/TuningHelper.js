// core/music/utils/TuningHelper.js
import guitar from '@/config/guitar';
import Pitch from '@/core/music/score/Pitch';

/**
 * Calculate pitch from string and fret position based on tuning
 * @param {number} string - String number (1-6, where 1 is highest/thinnest)
 * @param {number} fret - Fret number (0 = open string)
 * @param {Array<number>} tuning - Tuning array (default: standard tuning)
 * @param {number} accidental - Accidental preference: 0=natural, 1=sharp, -1=flat
 * @returns {Pitch} Pitch object with step, alter, octave
 */
export function getPitchFromStringFret(string, fret, tuning = guitar.tuning, accidental = 0) {
    // Validate inputs
    if (string < 1 || string > 6) throw new Error('String must be between 1 and 6');
    if (fret < 0) throw new Error('Fret must be non-negative');

    // Convert string number to array index (string 1 = index 5, string 6 = index 0)
    const stringIndex = 6 - string;

    // Calculate note index (0-11)
    const openStringNote = tuning[stringIndex];
    const noteIndex = (openStringNote + fret) % 12;

    // Calculate octave
    // Standard tuning base octaves: [E2, A2, D3, G3, B3, E4]
    const baseOctaves = [2, 2, 3, 3, 3, 4];
    const baseOctave = baseOctaves[stringIndex];
    const octave = baseOctave + Math.floor((openStringNote + fret) / 12);

    // Get note name based on accidental preference
    let noteName;
    if (accidental === -1) {
        // Prefer flats
        noteName = guitar.notes.flats[noteIndex];
    } else {
        // Prefer sharps or natural
        noteName = guitar.notes.sharps[noteIndex];
    }

    // Parse note name to get step and alter
    let step = noteName[0];
    let alter = 0;

    if (noteName.length > 1) {
        if (noteName[1] === '#') alter = 1;
        else if (noteName[1] === 'b') alter = -1;
    }

    return new Pitch(step, alter, octave);
}

/**
 * Get MIDI number from string and fret
 */
export function getMidiFromStringFret(string, fret, tuning = guitar.tuning) {
    const stringIndex = 6 - string;
    const baseOctaves = [2, 2, 3, 3, 3, 4];
    const baseOctave = baseOctaves[stringIndex];

    const openStringNote = tuning[stringIndex];
    const midi = (baseOctave + 1) * 12 + openStringNote + fret;

    return midi;
}
