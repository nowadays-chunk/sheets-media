import ScaleComponent from '../../../../../../../components/Elements/Spread/ScaleComponent';
import guitar from '../../../../../../../config/guitar';

export const getStaticPaths = async () => {
  // Return empty array to optimize build time and memory.
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  const { key, scale, mode } = params;

  const keyIndex = guitar.notes.sharps.indexOf(key);
  const scaleObj = guitar.scales[scale];
  const decodedKey = key.replace("sharp", "#");
  const decodedMode = mode.replace("sharp", "#");

  let modeIndex = -1;

  if (scaleObj && scaleObj.isModal) {
    modeIndex = scaleObj.modes.findIndex((m) => m.name.toLowerCase().replace(' ', '-') === decodedMode);
  }

  const validMode = modeIndex >= 0 ? modeIndex : 0;

  // Calculate the actual notes from intervals
  const intervals = scaleObj.modes[validMode].intervals;
  const notes = intervals.map(interval => {
    let semitones = 0;
    if (interval === '1') semitones = 0;
    else if (interval === 'b2' || interval === '2') semitones = interval === 'b2' ? 1 : 2;
    else if (interval === 'b3') semitones = 3;
    else if (interval === '3') semitones = 4;
    else if (interval === '4' || interval === 'b4') semitones = interval === 'b4' ? 4 : 5;
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
    else if (interval === '#2') semitones = 3;

    const noteIndex = (keyIndex + semitones) % 12;
    return guitar.notes.sharps[noteIndex];
  });

  const notesString = notes.join(', ');

  // Generate the title based on the params
  const title = `Scale: ${scaleObj.name} in ${decodedKey} Mode ${scaleObj.modes[validMode].name}`;
  const description = `Learn ${scaleObj.name} scale in ${scaleObj.modes[validMode].name} mode in the key of ${decodedKey} on guitar. Notes: ${notesString}. Master all CAGED positions and patterns for this scale mode across the fretboard.`;

  const boards = ['C', 'A', 'G', 'E', 'D'].map((cagedSystemElement) => {
    return {
      keyIndex,
      scale: scale,
      modeIndex: validMode,
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
    revalidate: 60
  };
};

export default ScaleComponent;
