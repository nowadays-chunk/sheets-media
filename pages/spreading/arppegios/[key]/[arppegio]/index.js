import ArpeggioComponent from '../../../../../components/Elements/Spread/ArppegioComponent';
import guitar from '../../../../../config/guitar';

export const getStaticPaths = async () => {
    const { notes, arppegios } = guitar;
    const paths = [];

    notes.sharps.forEach((key) => {
        if (arppegios && Object.keys(arppegios).length > 0) {
            Object.keys(arppegios).forEach((arppegioKey) => {
                const arppegio = arppegios[arppegioKey];
                if (arppegio) {
                    paths.push({ params: { key: key.replace('#', 'sharp'), arppegio: arppegioKey.replace('#', 'sharp') } });
                }
            });
        }
    });

    return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
    const { key, arppegio } = params;

    const decodedKey = key.replace('sharp', '#');
    const decodedArppegio = arppegio.replace('sharp', '#');

    const keyIndex = guitar.notes.sharps.indexOf(decodedKey);

    // Calculate the actual notes from intervals
    const intervals = guitar.arppegios[decodedArppegio].intervals;
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
    const title = `Arpeggio ${guitar.arppegios[decodedArppegio].name} in ${decodedKey}`;
    const description = `Learn ${guitar.arppegios[decodedArppegio].name} arpeggio in the key of ${decodedKey} on guitar. Notes: ${notesString}. Master all CAGED positions and patterns for this arpeggio across the fretboard.`;

    const boards = ['C', 'A', 'G', 'E', 'D'].map((cagedSystemElement) => {
        return {
            keyIndex,
            quality: decodedArppegio,
            shape: cagedSystemElement,
            board: 'references3' + '-' + cagedSystemElement,
        }
    });

    return {
        props: {
            boards: boards,
            title,
            description
        },
    };
};

export default ArpeggioComponent;



