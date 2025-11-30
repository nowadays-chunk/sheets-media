import React from 'react';
import MusicApp from '../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import ArticleCard from '../Listing/ArticleCard'; // Adjust the path if needed
import Meta from '../Partials/Head';
import { Typography } from '@mui/material';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ArppegioComponent = ({ board, keyIndex, quality, shape, title}) => {

  return (
    <Root>
      <Meta title={title} description="Explore my complete references for musical keys, scales, modes, and arpeggios. Find detailed information and resources for all keys, sharps, scales, modes, and arpeggios to enhance your musical knowledge."></Meta>
      <Typography variant="h6">
        {title}
      </Typography>
      <MusicApp
        display="arppegio"
        board={board}
        keyIndex={keyIndex}
        quality={quality}
        shape={shape}
        
        showFretboardControls={false}
        showCircleOfFifths={false}
        showFretboard={true}
        showChordComposer={false}
        showProgressor={false}
        showSongsSelector={false}
      />
      <Typography variant="h6">
        Exercice : Guess the arpeggio without looking at the fretboard #1
      </Typography>
    </Root>
  );
};

export default ArppegioComponent;
