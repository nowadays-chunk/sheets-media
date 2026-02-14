import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MusicApp from '../../Containers/MusicApp';
import { updateStateProperty } from '../../../redux/actions';
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Container, Box, Grid, Chip, Divider, Stack } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';
import { getAbsoluteNotes, getAnalysis } from '../../../core/music/musicTheory';

const Root = styled('div')({
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 50,
});

const QueryPair = ({ pair }) => {
    const dispatch = useDispatch();
    const boards = useSelector(state =>
        state.fretboard.components.filter(b => b.generalSettings.page === pair.boardId),
        shallowEqual
    );

    useEffect(() => {
        if (boards.length >= 2) {
            // Force batch update for both boards
            // Update Board 0 (Root Chord)
            const root = pair.rootSettings;
            dispatch(updateStateProperty(boards[0].id, "generalSettings.choice", root.display));
            dispatch(updateStateProperty(boards[0].id, "keySettings." + root.display, root.keyIndex));
            if (root.display === 'arppegio') {
                dispatch(updateStateProperty(boards[0].id, "arppegioSettings.arppegio", root.quality));
                dispatch(updateStateProperty(boards[0].id, "arppegioSettings.shape", root.shape));
            } else if (root.display === 'chord') {
                dispatch(updateStateProperty(boards[0].id, "chordSettings.chord", root.quality));
                dispatch(updateStateProperty(boards[0].id, "chordSettings.shape", root.shape));
            }

            // Update Board 1 (Match)
            const match = pair.matchSettings;
            dispatch(updateStateProperty(boards[1].id, "generalSettings.choice", match.display));
            dispatch(updateStateProperty(boards[1].id, "keySettings." + match.display, match.keyIndex));
            if (match.display === 'scale') {
                dispatch(updateStateProperty(boards[1].id, "scaleSettings.scale", match.scale));
                const modeName = guitar.scales[match.scale]?.modes?.[match.modeIndex]?.name || '';
                dispatch(updateStateProperty(boards[1].id, "modeSettings.mode", modeName));
                dispatch(updateStateProperty(boards[1].id, "scaleSettings.shape", match.shape));
            } else if (match.display === 'arppegio') {
                dispatch(updateStateProperty(boards[1].id, "arppegioSettings.arppegio", match.quality));
                dispatch(updateStateProperty(boards[1].id, "arppegioSettings.shape", match.shape));
            }
        }
    }, [pair, boards, dispatch]);

    // Harmonic Analysis
    const rootNotes = getAbsoluteNotes(pair.rootSettings.display, pair.rootSettings.quality, pair.rootSettings.keyIndex);
    const matchNotes = pair.matchSettings.display === 'scale'
        ? getAbsoluteNotes('scale', pair.matchSettings.scale, pair.matchSettings.keyIndex, pair.matchSettings.modeIndex)
        : getAbsoluteNotes('arppegio', pair.matchSettings.quality, pair.matchSettings.keyIndex);

    const analysis = getAnalysis(rootNotes, matchNotes, pair.rootSettings.keyIndex, pair.matchSettings.keyIndex);

    // Matching Data from config
    const rootData = guitar.arppegios[pair.rootSettings.quality] || {};
    const matchingScales = rootData.matchingScales || [];
    const matchingArps = rootData.matchingArpeggios || [];

    return (
        <Box mb={8} p={4} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, bgcolor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <Grid container spacing={4} alignItems="flex-start">
                {/* LEFT COLUMN: 35% Title */}
                <Grid item xs={12} md={4.2}>
                    <Box sx={{ pr: 4, borderRight: { md: '1px solid #f0f0f0' }, height: '100%' }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: '900',
                                color: '#1a1a1a',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            {pair.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                            Harmonic Match Analysis
                        </Typography>

                        <Stack spacing={3}>
                            {matchingScales.length > 0 && (
                                <Box>
                                    <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, display: 'block' }}>
                                        Matching Scales
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {matchingScales.map(s => <Chip key={s} label={s} size="small" variant="outlined" sx={{ borderRadius: 1 }} />)}
                                    </Box>
                                </Box>
                            )}

                            {matchingArps.length > 0 && (
                                <Box>
                                    <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1, display: 'block' }}>
                                        Matching Arpeggios
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {matchingArps.map(a => <Chip key={a} label={a} size="small" variant="outlined" sx={{ borderRadius: 1 }} />)}
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Grid>

                {/* RIGHT COLUMN: 65% Fretboard + Description */}
                <Grid item xs={12} md={7.8}>
                    <Box sx={{ pl: { md: 2 } }}>
                        <MusicApp
                            board={pair.boardId}
                            showStats={true}
                            showFretboard={true}
                            showFretboardControls={false}
                            showCircleOfFifths={false}
                            showChordComposer={false}
                            showProgressor={false}
                            showSongsSelector={false}
                        />

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom fontWeight="700">Common Ground</Typography>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                    Notes and intervals shared between both structures.
                                </Typography>
                                <Box mb={2}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Common Notes:</Typography>
                                    <Typography variant="body1" fontWeight="600">{analysis.commonNotes.join(', ')}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Common Intervals:</Typography>
                                    <Typography variant="body1" fontWeight="600">{analysis.commonIntervals.join(', ')}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom fontWeight="700">Point of Divergence</Typography>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                    Notes and intervals unique to each structure.
                                </Typography>
                                <Box mb={2}>
                                    <Typography variant="subtitle2" color="error" gutterBottom>Unique to Root:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        Notes: {analysis.only1Notes.length > 0 ? analysis.only1Notes.join(', ') : 'None'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Intervals: {analysis.only1Intervals.length > 0 ? analysis.only1Intervals.join(', ') : 'None'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="error" gutterBottom>Unique to Match:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        Notes: {analysis.only2Notes.length > 0 ? analysis.only2Notes.join(', ') : 'None'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Intervals: {analysis.only2Intervals.length > 0 ? analysis.only2Intervals.join(', ') : 'None'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

const QueryComponent = (props) => {
    const { pairings, title, description, queryInfo, keywords } = props;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
            </Head>
            <Root>
                <ScoreProvider>
                    <Container maxWidth="xl">

                        {pairings && pairings.length > 0 ? (
                            pairings.map((pair, index) => (
                                <QueryPair key={index} pair={pair} />
                            ))
                        ) : (
                            <Typography variant="h6" align="center">No matches found for this query.</Typography>
                        )}
                    </Container>
                </ScoreProvider>
            </Root>
        </>
    );
};

export default QueryComponent;
