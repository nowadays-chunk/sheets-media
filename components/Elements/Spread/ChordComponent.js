// components/ScaleComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import ArticleCard from '../../Listing/ArticleCard'; // Adjust the path if needed
import Meta from '../../Partials/Head';
import { Typography } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";

const Root = styled('div')({
  marginTop: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ChordComponent = (props) => {
  const { boards, title, description } = props;

  return (
    <Root>
      <Meta
        title={title}
        description={description || "Learn guitar chord shapes and positions on the fretboard. Master chord voicings using the CAGED system across all five positions."}></Meta>
      <Typography variant="h6">
        {title}
      </Typography>
      <ScoreProvider>
        {
          boards.map((el, index) => {
            return <MusicApp
              key={index}
              display="chord"
              board={el.board}
              keyIndex={el.keyIndex}
              quality={el.quality}
              shape={el.shape}

              showStats={false}
              showFretboardControls={false}
              showCircleOfFifths={false}
              showFretboard={true}
              showChordComposer={false}
              showProgressor={false}
              showSongsSelector={false}
            />
          })
        }
      </ScoreProvider>
    </Root>
  );
};

export default ChordComponent;
