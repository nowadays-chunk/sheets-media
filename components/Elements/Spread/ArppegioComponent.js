// components/ScaleComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';

const Root = styled('div')({
  marginTop: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ArppegioComponent = (props) => {
  const { boards, title, description } = props;

  return (
    <Root>
      <ScoreProvider>
        <Head>
          <title>{title}</title>
          <meta
            name="description"
            content={description || "Explore arpeggio patterns on guitar fretboard. Learn chord arpeggios across all positions using the CAGED system for better improvisation and soloing."}
          />
          <meta
            name="keywords"
            content={DEFAULT_KEYWORDS}
          />
        </Head>
        <Typography variant="h6">
          {title}
        </Typography>
        {
          boards.map((el, index) => {
            return <MusicApp
              key={index}
              display="arppegio"
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

export default ArppegioComponent;
