import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import Link from 'next/link';
import TournamentSchedule from '../../components/Pages/TournamentSchedule';
import WinnersRanking from '../../components/Pages/WinnersRanking';
import ArtworkGallery from '../../components/Pages/ArtworkGallery';
import tournamentsData from '../../data/tournaments.json';
import winnersData from '../../data/winners.json';
import { DEFAULT_KEYWORDS } from '../../data/seo';

export async function getStaticProps() {
    return {
        props: {
            tournaments: tournamentsData,
            winners: winnersData,
        },
    };
}

const CompetitionPage = ({ tournaments, winners }) => {
    return (
        <>
            <Head>
                <title>Join Competition - Guitar Sheets</title>
                <meta
                    name="description"
                    content="Join our guitar competition and show off your skills! Compete with guitarists worldwide, win amazing prizes, and showcase your talent."
                />
                <meta
                    name="keywords"
                    content={DEFAULT_KEYWORDS}
                />
            </Head>

            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 12,
                    mt: 8,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 3 }}
                    >
                        Guitar Competitions
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
                        Showcase your skills and win amazing prizes!
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/competition/video-contest" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                sx={{
                                    py: 2,
                                    px: 4,
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'grey.100' },
                                }}
                            >
                                Video Contest
                            </Button>
                        </Link>
                        <Link href="/competition/submit-track" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 2,
                                    px: 4,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                }}
                            >
                                Submit a Track
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Box>

            {/* Tournament Schedule Section */}
            <TournamentSchedule tournaments={tournaments} />

            <Divider sx={{ my: 8 }} />

            {/* Winners Ranking Section */}
            <WinnersRanking winners={winners} />

            <Divider sx={{ my: 8 }} />

            {/* Artwork Gallery Section */}
            <ArtworkGallery winners={winners} />

            {/* Footer Navigation */}
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Link href="/" passHref legacyBehavior>
                    <Button variant="outlined" color="primary" size="large">
                        Back to Home
                    </Button>
                </Link>
            </Box>
        </>
    );
};

export default CompetitionPage;
