import React from 'react';
import Link from 'next/link';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Head from 'next/head';
import guitar from '../../config/guitar';
import { styled } from '@mui/system';

const Root = styled('div')({
    paddingTop: 100,
    paddingBottom: 50,
    background: '#fafafa',
    minHeight: '100vh',
});

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

const QueryIndex = () => {
    const keys = guitar.notes.sharps;
    const CAGED_SHAPES = ['C', 'A', 'G', 'E', 'D'];

    // Categorize arpeggios that have matches
    const chordsWithMatches = Object.entries(guitar.arppegios).filter(
        ([_, data]) => (data.matchingScales?.length > 0 || data.matchingArpeggios?.length > 0)
    );

    return (
        <Root>
            <Head>
                <title>Music Theory Query Index - Matching Patterns</title>
                <meta name="description" content="Reference list for all musical pattern matches on guitar. Find scales and arpeggios that work over specific chords across all CAGED shapes." />
            </Head>
            <Container maxWidth="lg">
                <Box mb={6} textAlign="center">
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                        Reference Registry
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                        Explore harmonic relationships across every key and CAGED shape.
                    </Typography>
                </Box>

                {keys.map((key) => {
                    const keySlug = slugify(key);
                    return (
                        <Accordion key={key} sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <AccordionSummary expandMoreIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{key} / {keySlug.toUpperCase()}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {chordsWithMatches.map(([chordKey, chordData]) => (
                                    <Box key={chordKey} mb={4}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                            Over Chord {chordData.name} ({key}):
                                        </Typography>

                                        <Box pl={2}>
                                            {/* Scales Section */}
                                            {chordData.matchingScales?.length > 0 && (
                                                <Box mb={2}>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Matching Scales:</Typography>
                                                    <List dense>
                                                        {chordData.matchingScales.map((scaleName) => (
                                                            <ListItem key={scaleName} sx={{ display: 'block' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>Scale {scaleName}</Typography>
                                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                                    {CAGED_SHAPES.map(shape => (
                                                                        <Link
                                                                            key={shape}
                                                                            href={`/matches/scale_${slugify(scaleName)}_matches_chord_${slugify(chordData.name)}_in_${keySlug}_key_and_${shape.toLowerCase()}_shape`}
                                                                            passHref
                                                                        >
                                                                            <Typography variant="caption" sx={{ color: 'secondary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                                                                {shape} Shape
                                                                            </Typography>
                                                                        </Link>
                                                                    ))}
                                                                </Box>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}

                                            {/* Arpeggios Section */}
                                            {chordData.matchingArpeggios?.length > 0 && (
                                                <Box>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Matching Arpeggios:</Typography>
                                                    <List dense>
                                                        {chordData.matchingArpeggios.map((arpName) => (
                                                            <ListItem key={arpName} sx={{ display: 'block' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>Arpeggio {arpName}</Typography>
                                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                                    {CAGED_SHAPES.map(shape => (
                                                                        <Link
                                                                            key={shape}
                                                                            href={`/matches/arpeggio_${slugify(arpName)}_matches_chord_${slugify(chordData.name)}_in_${keySlug}_key_and_${shape.toLowerCase()}_shape`}
                                                                            passHref
                                                                        >
                                                                            <Typography variant="caption" sx={{ color: 'secondary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                                                                {shape} Shape
                                                                            </Typography>
                                                                        </Link>
                                                                    ))}
                                                                </Box>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}
                                        </Box>
                                        <Divider sx={{ mt: 2 }} />
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Container>
        </Root>
    );
};

export default QueryIndex;
