import guitar from '../../config/guitar';

/**
 * Calculates absolute note indices (0-11) for a given musical entity.
 * 
 * @param {string} type - 'scale', 'chord', or 'arppegio'
 * @param {string} subType - The key name in guitar config (e.g., 'major', 'M', '7')
 * @param {number} keyIndex - The root note index (0-11, where 0 is C)
 * @param {number} modeIndex - Optional mode index for scales (0-indexed)
 * @returns {number[]} Array of absolute note indices in ascending order
 */
export const getAbsoluteNotes = (type, subType, keyIndex, modeIndex = 0) => {
    let formula = [];
    if (type === 'scale') {
        const scaleData = guitar.scales[subType];
        if (!scaleData) return [];
        formula = scaleData.formula || [];
    } else if (type === 'chord' || type === 'arppegio' || type === 'arp') {
        const arpData = guitar.arppegios[subType];
        if (!arpData) return [];
        formula = arpData.formula || [];
    }

    let current = keyIndex;
    let notes = [current];
    formula.forEach(step => {
        current = (current + step) % 12;
        notes.push(current);
    });

    // Handle Modes for scales
    if (type === 'scale' && modeIndex > 0) {
        // The notes array contains the notes of the parent scale starting from keyIndex.
        // To get the mode, we shift the starting point to the modeIndex-th note.
        const shifted = Array.from(new Set(notes.slice(modeIndex).concat(notes.slice(0, modeIndex))));
        return shifted.sort((a, b) => a - b);
    }

    return Array.from(new Set(notes)).sort((a, b) => a - b);
};

/**
 * Checks if the notes of a chord are a subset of the notes of a target pattern.
 * 
 * @param {number[]} chordNotes - Absolute indices of chord notes
 * @param {number[]} targetNotes - Absolute indices of target notes (scale/arpeggio)
 * @returns {boolean} True if all chord notes are present in the target
 */
export const checkMatch = (chordNotes, targetNotes) => {
    if (!chordNotes?.length || !targetNotes?.length) return false;
    return chordNotes.every(note => targetNotes.includes(note));
};
