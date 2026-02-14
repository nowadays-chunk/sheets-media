import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MusicApp from '../../components/Containers/MusicApp';
import PlayWizard from '../../components/Play/PlayWizard';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import guitar from '../../config/guitar';
import { updateStateProperty, newFretboard, addFretboard } from '../../redux/actions';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export const getStaticProps = async (context) => {
  const elements = guitar.notes.sharps.flatMap((key) => {
    const chords = Object.keys(guitar.arppegios).map((chordKey) => {
      const title = `Chord: ${guitar.arppegios[chordKey].name} in ${key}`;
      return {
        label: title,
        href: `/spreading/chords/${key.replace('#', 'sharp')}/${chordKey.replace('#', 'sharp')}`,
      };
    });

    const arpeggios = Object.keys(guitar.arppegios).flatMap((arppegioKey) => {
      const title = `Arpeggio: ${guitar.arppegios[arppegioKey].name} in ${key}`;
      return [
        {
          label: title,
          href: `/spreading/arppegios/${key.replace('#', 'sharp')}/${arppegioKey.replace('#', 'sharp')}`,
        },
      ];
    });

    const scales = Object.keys(guitar.scales).flatMap((scaleKey) => {
      if (guitar.scales[scaleKey].isModal === true) {
        return [
          ...guitar.scales[scaleKey].modes.map((mode) => {
            const title = `Scale: ${guitar.scales[scaleKey].name} in ${key} (Mode: ${mode.name})`;
            return {
              label: title,
              href: `/spreading/scales/${key.replace('#', 'sharp')}/${scaleKey}/modal/${decodeURIComponent(mode.name.toLowerCase().replace(' ', '-')).replace('#', 'sharp')}`,
            };
          }),
        ];
      } else {
        const title = `Scale: ${guitar.scales[scaleKey].name} in ${key} (Single)`;
        return [
          {
            label: title,
            href: `/spreading/scales/${key.replace('#', 'sharp')}/${scaleKey}/single`,
          },
        ];
      }
    });

    return [...chords, ...arpeggios, ...scales];
  });

  return {
    props: {
      elements,
    },
    revalidate: 60,
  };
};

const PlayPage = (props) => {
  const [view, setView] = useState('wizard');
  const dispatch = useDispatch();
  const router = useRouter();

  // Find the active fretboard for this page (play)
  const fretboards = useSelector(state => state.fretboard.components);
  const activeFretboard = fretboards.find(b => b.generalSettings.page === 'play');

  const handleSelect = (selection) => {
    let boardId = activeFretboard?.id;

    if (!boardId) {
      // Create new board for the 'play' page
      const newBoard = newFretboard(
        6,
        25,
        [4, 7, 2, 9, 11, 4],
        [4, 3, 3, 3, 2, 2],
        'play',
        selection.type
      );
      dispatch(addFretboard(newBoard));
      boardId = newBoard.id;
    }

    // Dispatch selection to Redux
    // Note: We use the same property update pattern as MusicApp's updateBoardsCallback
    if (boardId) {
      dispatch(updateStateProperty(boardId, "generalSettings.choice", selection.type));
      dispatch(updateStateProperty(boardId, "keySettings." + selection.type, selection.key));

      if (selection.type === 'scale') {
        dispatch(updateStateProperty(boardId, "scaleSettings.scale", selection.value));
        if (selection.mode !== undefined && guitar.scales[selection.value]) {
          const modeName = guitar.scales[selection.value].modes[selection.mode].name;
          dispatch(updateStateProperty(boardId, "modeSettings.mode", modeName));
        }
      } else if (selection.type === 'chord') {
        dispatch(updateStateProperty(boardId, "chordSettings.chord", selection.value));
      } else if (selection.type === 'arppegio') {
        dispatch(updateStateProperty(boardId, "arppegioSettings.arppegio", selection.value));
      }

      if (selection.shape) {
        dispatch(updateStateProperty(boardId, selection.type + "Settings.shape", selection.shape));
      }
    }

    if (selection.href) {
      router.push(selection.href);
    } else {
      setView('app');
    }
  };

  if (view === 'wizard') {
    return <PlayWizard elements={props.elements} onSelect={handleSelect} />;
  }

  return (
    <div style={{ marginTop: '100px' }}>
      <ScoreProvider>
        <MusicApp
          board="play"
          showAddMoreFretboardsButton={true}
          showFretboardControls={true}
          showCircleOfFifths={true}
          showFretboard={true}
          showChordComposer={false}
          showProgressor={false}
          showSongsSelector={false}
          showStats={true}
          leftDrawerOpen={props.leftDrawerOpen}
          leftDrawerWidth={props.leftDrawerWidth}
          title="Play And Visualize Guitar Music Sheets"
          description="Play And Visualize Chords, Scales And Arppegios In A Complete Reference Of Guitar Music Sheets."
        />
      </ScoreProvider >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Button variant="outlined" onClick={() => setView('wizard')}>Back to Search</Button>
      </div>
    </div>
  );
};

export default PlayPage;
