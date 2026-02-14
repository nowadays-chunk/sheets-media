// components/ArppegioComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Box, Grid, Chip, Divider, Stack } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';
import { getAbsoluteNotes, getNoteName, getIntervalName } from '../../../core/music/musicTheory';

const Root = styled('div')({
  marginTop: 100,
  paddingBottom: 100,
});

const ArppegioComponent = (props) => {
  const { boards, title, description } = props;

  const firstBoard = boards[0] || {};
  const rootNotes = getAbsoluteNotes('arppegio', firstBoard.quality, firstBoard.keyIndex);
  const rootData = guitar.arppegios[firstBoard.quality] || {};
  const matchingScales = rootData.matchingScales || [];
  const matchingArps = rootData.matchingArpeggios || [];

  // Tonal Properties Metadata
  const noteNames = rootNotes.map(getNoteName);
  const intervalNames = rootNotes.map(n => getIntervalName((n - firstBoard.keyIndex + 12) % 12));


  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || "Explore arpeggio patterns."} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
      </Head>
      <Root>
        {/* TOP: Unified Heading - LEFT ALIGNED */}
        <Box sx={{
          textAlign: "left",
          mb: 8,
          px: { xs: '15px', md: '180px' }
        }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: '900',
              color: '#1a1a1a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontSize: { xs: '3rem', md: '5rem' },
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 500 }}>
            The 5 Essential CAGED Shapes
          </Typography>

          <Stack direction="row" spacing={2} mt={3}>
            {matchingScales.slice(0, 3).map(s => <Chip key={s} label={s} variant="outlined" color="primary" />)}
          </Stack>
        </Box>

        <ScoreProvider>
          {/* MIDDLE: Fretboards Stack */}
          <Stack spacing={8}>
            {boards.map((el, index) => (
              <Box key={index}>
                <Box sx={{ px: { xs: '15px', md: '180px' }, mb: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0 }}>
                    Position {index + 1} — {el.key} {el.quality} (Shape {el.shape})
                  </Typography>
                </Box>
                <MusicApp
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
              </Box>
            ))}
          </Stack>
        </ScoreProvider>

        {/* BOTTOM: Unified Description */}
        <Box sx={{
          mt: 10,
          px: { xs: '15px', md: '180px' }
        }}>
          <Box p={6} sx={{ bgcolor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee', mb: 6 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
              Arpeggio Construction
            </Typography>
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="800">Tonal Content</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  The pitch classes that define the core melodic structure of this {firstBoard.quality} arpeggio.
                </Typography>
                <Box mb={4}>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Note Names:</Typography>
                  <Typography variant="h6">{noteNames.join(', ')}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="800">Interval Map</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  The specific interval sequence relative to the tonic Root ({firstBoard.key}).
                </Typography>
                <Box mb={4}>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Interval Structure:</Typography>
                  <Typography variant="h6">{intervalNames.join(', ')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>


          {matchingArps.length > 0 && (
            <Box mt={8}>
              <Divider sx={{ mb: 4 }} />
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', mb: 2, display: 'block' }}>
                Alternative Voicings & Structures
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {matchingArps.map(a => <Chip key={a} label={a} variant="filled" sx={{ borderRadius: 2 }} />)}
              </Box>
            </Box>
          )}
        </Box>
      </Root>
    </>
  );
};

export default ArppegioComponent;
