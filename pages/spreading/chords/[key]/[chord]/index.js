// pages/references/[key]/arppegios/[arppegio]/[quality]/[shape]/index.js
import ChordComponent from '../../../../../components/Elements/Spread/ChordComponent';
import guitar from '../../../../../config/guitar';

export const getStaticPaths = async () => {
    // Return empty array to optimize build time and memory.
    return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
    const { key, chord } = params;
    const decodedKey = key.replace('sharp', '#');
    const decodedChord = chord.replace('sharp', '#');

    const keyIndex = guitar.notes.sharps.indexOf(decodedKey);

    // Calculate the actual notes from intervals
    const intervals = guitar.arppegios[decodedChord].intervals;
    const notes = intervals.map(interval => {
        let semitones = 0;
        if (interval === '1') semitones = 0;
        else if (interval === 'b2' || interval === '2') semitones = interval === 'b2' ? 1 : 2;
        else if (interval === 'b3') semitones = 3;
        else if (interval === '3') semitones = 4;
        else if (interval === '4') semitones = 5;
        else if (interval === '#4') semitones = 6;
        else if (interval === 'b5') semitones = 6;
        else if (interval === '5') semitones = 7;
        else if (interval === '#5') semitones = 8;
        else if (interval === 'b6' || interval === '6') semitones = interval === 'b6' ? 8 : 9;
        else if (interval === 'bb7' || interval === 'b7' || interval === '7') {
            if (interval === 'bb7') semitones = 9;
            else if (interval === 'b7') semitones = 10;
            else semitones = 11;
        }
        else if (interval === '9') semitones = 2;
        else if (interval === '11') semitones = 5;
        else if (interval === '13') semitones = 9;

        const noteIndex = (keyIndex + semitones) % 12;
        return guitar.notes.sharps[noteIndex];
    });

    const notesString = notes.join(', ');

    // Generate the title based on the params
    const title = `Chord: ${guitar.arppegios[decodedChord].name} in ${decodedKey}`;
    const description = `Learn ${guitar.arppegios[decodedChord].name} chord in the key of ${decodedKey} on guitar. Notes: ${notesString}. Explore all CAGED positions and chord voicings across the fretboard.`;

    const boards = ['C', 'A', 'G', 'E', 'D'].map((cagedSystemElement) => {
        return {
            keyIndex,
            quality: decodedChord,
            shape: cagedSystemElement,
            board: 'references1-' + cagedSystemElement,
        }
    })

    return {
        props: {
            boards,
            title,
            description
        },
        revalidate: 60
    };
};

export default ChordComponent;