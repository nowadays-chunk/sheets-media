import ScaleComponent from '../../../../../../components/Elements/Spread/ScaleComponent';
import guitar from '../../../../../../config/guitar';

export const getStaticPaths = async () => {
  const { notes, scales, shapes } = guitar;
  const paths = [];

  notes.sharps.forEach((key) => {
    Object.keys(scales).forEach((scaleKey) => {
      const scale = scales[scaleKey];
      if (!scale.isModal) {
        shapes.names.forEach((shape) => {
          paths.push({ params: { key: key.replace("#", "sharp"), scale: scaleKey } });
        });
      }
    });
  });

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { key, scale } = params;
  const decodedKey = key.replace("sharp", "#");

  const keyIndex = guitar.notes.sharps.indexOf(decodedKey);
  const scaleObj = guitar.scales[scale];

  // Calculate the actual notes from intervals
  const intervals = scaleObj.intervals;
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

    const noteIndex = (keyIndex + semitones) % 12;
    return guitar.notes.sharps[noteIndex];
  });

  const notesString = notes.join(', ');

  // Generate the title based on the params
  const title = `Scale ${scaleObj.name} in ${decodedKey} Single`;
  const description = `Learn ${scaleObj.name} scale in the key of ${decodedKey} on guitar. Notes: ${notesString}. Master all CAGED positions and patterns for this scale across the fretboard.`;

  const boards = ['C', 'A', 'G', 'E', 'D'].map((cagedSystemElement) => {
    return {
      keyIndex,
      scale: scale,
      modeIndex: -1,
      shape: cagedSystemElement,
      board: 'references2' + '-' + cagedSystemElement,
    }
  })

  return {
    props: {
      boards: boards,
      title,
      description
    },
  };
};

export default ScaleComponent;
