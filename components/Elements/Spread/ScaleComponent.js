// components/ScaleComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Box, Grid, Chip, Divider, Stack } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';
import { getAbsoluteNotes, getNoteName, getIntervalName, getAnalysis } from '../../../core/music/musicTheory';

const Root = styled('div')({
  marginTop: 100,
  paddingBottom: 100,
});

const ScaleComponent = (props) => {
  const { boards, title, description } = props;

  const firstBoard = boards[0] || {};
  const scaleNotes = getAbsoluteNotes('scale', firstBoard.scale, firstBoard.keyIndex, firstBoard.modeIndex);
  const scaleData = guitar.scales[firstBoard.scale] || {};
  const modeName = scaleData.modes?.[firstBoard.modeIndex]?.name || scaleData.name;

  // Global Metadata
  const noteNames = scaleNotes.map(getNoteName);
  const intervalNames = scaleNotes.map(n => getIntervalName((n - firstBoard.keyIndex + 12) % 12));

  // Expanded Comparative Analysis
  const comparativeAnalysis = [];
  const matchingArps = scaleData.matchingArpeggios || [];

  // Compare Scale against Top Matching Arpeggios
  matchingArps.slice(0, 2).forEach(arpName => {
    const targetNotes = getAbsoluteNotes('arppegio', arpName.toLowerCase(), firstBoard.keyIndex);
    const analysis = getAnalysis(scaleNotes, targetNotes, firstBoard.keyIndex, firstBoard.keyIndex);
    comparativeAnalysis.push({ association: arpName, type: 'Arpeggio', ...analysis });
  });

  const isMode = firstBoard.modeIndex > 0;
  const suffix = isMode ? 'Mode' : 'Scale';

  return (
    <Root>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || "Explore guitar scales."} />
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
          <Chip label={`${scaleNotes.length} Notes`} variant="outlined" color="primary" />
          <Chip label={scaleData.degree || 'Modal'} variant="outlined" color="secondary" />
        </Stack>
      </Box>

      <ScoreProvider>
        {/* MIDDLE: Fretboards Stack */}
        <Stack spacing={8}>
          {boards.map((el, index) => (
            <Box key={index}>
              <Box sx={{ px: { xs: '15px', md: '180px' }, mb: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 0 }}>
                  Position {index + 1} — {el.key} {modeName} (Shape {el.shape})
                </Typography>
              </Box>
              <MusicApp
                display="scale"
                board={el.board}
                keyIndex={el.keyIndex}
                scale={el.scale}
                modeIndex={el.modeIndex}
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

      {/* BOTTOM: Unified Description - EXPANDED COMPARATIVE */}
      <Box sx={{
        mt: 10,
        px: { xs: '15px', md: '180px' }
      }}>
        <Box p={6} sx={{ bgcolor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
            Scale Construction
          </Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="800">Tonal Content</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The pitch classes that define the unique flavor of the {firstBoard.key} {modeName} scale.
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
              Harmonic Context (Core Arpeggios)
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {comparativeAnalysis.map((item, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Box p={4} sx={{ bgcolor: '#fff', borderRadius: 4, border: '1px solid #eee', height: '100%' }}>
                    <Typography variant="overline" color="secondary" sx={{ fontWeight: 800 }}>
                      Sub-Structure: {item.association} {item.type}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box mb={3}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Shared Harmonic DNA:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.commonNotes.join(', ')} ({item.commonIntervals.join(', ')})
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Scale Color (Beyond Arp):
                      </Typography>
                      <Typography variant="body1">
                        {item.only1Notes.length > 0 ? `${item.only1Notes.join(', ')} (${item.only1Intervals.join(', ')})` : 'All Arpeggio notes are in this scale'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box p={6} sx={{ bgcolor: '#f8f9fa', borderRadius: 8, border: '1px solid #eee' }}>
          {scaleData.modes && scaleData.modes.length > 1 && (
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', mb: 2, display: 'block' }}>
                Other Modes from the Parent {scaleData.name} Scale
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {scaleData.modes.filter((_, i) => i !== firstBoard.modeIndex).map(m => (
                  <Chip key={m.name} label={m.name} variant="filled" sx={{ borderRadius: 2, opacity: 0.8 }} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Root>
  );
};

export default ScaleComponent;
