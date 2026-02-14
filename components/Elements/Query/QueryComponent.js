import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MusicApp from '../../Containers/MusicApp';
import { updateStateProperty } from '../../../redux/actions';
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Container, Box } from '@mui/material';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';

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

    return (
        <Box mb={8} p={3} sx={{ border: '1px solid #ddd', borderRadius: 2, bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', color: '#000', borderBottom: '1px solid #f0f0f0', pb: 1, mb: 3 }}>
                {pair.title}
            </Typography>
            <MusicApp
                board={pair.boardId}
                showStats={true}
                showFretboard={true}
                showFretboardControls={false}
                showCircleOfFifths={false}
                showChordComposer={false}
                showProgressor={false}
                showSongsSelector={false}
            // We don't pass quality/display here to prevent MusicApp's internal logic from overwriting our manual dual-board setup
            />
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
