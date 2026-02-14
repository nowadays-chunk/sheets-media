import React from 'react';
import MusicApp from '../../components/Containers/MusicApp';

import { ScoreProvider } from "@/core/editor/ScoreContext";

const TheCircleOfFifths = () => {

  return (
    <div style={{ marginTop: '100px' }}>
      <ScoreProvider>
        <MusicApp
          board="circle"
          showFretboardControls={false}
          showCircleOfFifths={true}
          showFretboard={false}
          showChordComposer={false}
          showProgressor={false}
          showSongsSelector={false}
          title="Interactive Circle Of Fifths For Musical Guitar Sheets, Spinnable, Colored and Pointing To The Major Scale And Its Relative Minor"
          description="Play And Visualize The Keys On The Circle Of Fifths While It Being Colored And Spinned With Red And Blue."
        />
      </ScoreProvider>
    </div>
  );
};

export default TheCircleOfFifths;
