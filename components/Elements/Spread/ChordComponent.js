// components/ChordComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Box, Grid, Chip, Divider, Stack } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';
import { getAbsoluteNotes, getAnalysis, getNoteName, getIntervalName } from '../../../core/music/musicTheory';

const Root = styled('div')({
  marginTop: 100,
  paddingBottom: 100,
});

const ChordComponent = (props) => {
  const { boards, title, description } = props;

  const firstBoard = boards[0] || {};
  const rootNotes = getAbsoluteNotes('chord', firstBoard.quality, firstBoard.keyIndex);
  const rootData = guitar.arppegios[firstBoard.quality] || {};
  const matchingScales = rootData.matchingScales || [];
  const matchingArps = rootData.matchingArpeggios || [];

  // Tonal Properties Metadata
  const noteNames = rootNotes.map(getNoteName);
  const intervalNames = rootNotes.map(n => getIntervalName((n - firstBoard.keyIndex + 12) % 12));

  // Expanded Comparative Analysis
  const comparativeAnalysis = [];

  // 1. Compare against Top Scales
  matchingScales.slice(0, 2).forEach(scaleName => {
    const targetNotes = getAbsoluteNotes('scale', scaleName.toLowerCase(), firstBoard.keyIndex);
    const analysis = getAnalysis(rootNotes, targetNotes, firstBoard.keyIndex, firstBoard.keyIndex);
    comparativeAnalysis.push({ association: scaleName, type: 'Scale', ...analysis });
  });

  // 2. Compare against Top Arpeggios (excluding self if applicable)
  matchingArps.filter(a => a !== firstBoard.quality).slice(0, 2).forEach(arpName => {
    const targetNotes = getAbsoluteNotes('arppegio', arpName.toLowerCase(), firstBoard.keyIndex);
    const analysis = getAnalysis(rootNotes, targetNotes, firstBoard.keyIndex, firstBoard.keyIndex);
    comparativeAnalysis.push({ association: arpName, type: 'Arpeggio', ...analysis });
  });

  return (
    <Root>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || "Learn guitar chord shapes."} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
      </Head>

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
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.success', mb: 0 }}>
                  Position {index + 1} — {el.key} {el.quality} (Shape {el.shape})
                </Typography>
              </Box>
              <MusicApp
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
            Chord Construction
          </Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="800">Tonal Content</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The pitch classes that define the harmonic footprint of this {firstBoard.quality} chord.
              </Typography>
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Note Names:</Typography>
                <Typography variant="h6">{noteNames.join(', ')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="800">Interval Map</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The mathematical sequence of intervals relative to the tonic Root ({firstBoard.key}).
              </Typography>
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Interval Structure:</Typography>
                <Typography variant="h6">{intervalNames.join(', ')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {comparativeAnalysis.length > 0 && (
          <>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
              Relative & Comparative Analysis
            </Typography>
            <Grid container spacing={4}>
              {comparativeAnalysis.map((item, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Box p={4} sx={{ bgcolor: '#fff', borderRadius: 4, border: '1px solid #eee', height: '100%' }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
                      Relation to {item.type}: {item.association}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box mb={3}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Common Notes & Intervals:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.commonNotes.join(', ')} ({item.commonIntervals.join(', ')})
                      </Typography>
                    </Box>

                    <Box mb={3}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
                        Unique to {firstBoard.quality}:
                      </Typography>
                      <Typography variant="body1">
                        {item.only1Notes.length > 0 ? `${item.only1Notes.join(', ')} (${item.only1Intervals.join(', ')})` : 'None'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {item.type} Extensions (Beyond Chord):
                      </Typography>
                      <Typography variant="body1">
                        {item.only2Notes.length > 0 ? `${item.only2Notes.join(', ')} (${item.only2Intervals.join(', ')})` : 'None'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {matchingArps.length > 0 && (
          <Box mt={8}>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', mb: 2, display: 'block' }}>
              Other Related Harmonic Structures
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {matchingArps.map(a => <Chip key={a} label={a} variant="filled" sx={{ borderRadius: 2 }} />)}
            </Box>
          </Box>
        )}
      </Box>
    </Root>
  );
};

export default ChordComponent;
