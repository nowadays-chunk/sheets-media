import React from 'react';
import Meta from '../../components/Partials/Head';
import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

const CompetitionPage = () => {
    return (
        <>
            <Meta
                title="Join Competition - Guitar Sheets"
                description="Join our guitar competition and show off your skills!"
            />
            <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Join the Competition
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                    Showcase your skills and win amazing prizes!
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/competition/video-contest" passHref legacyBehavior>
                        <Button variant="contained" color="secondary" size="large" sx={{ py: 2, px: 4 }}>
                            Video Contest
                        </Button>
                    </Link>
                    <Link href="/competition/submit-track" passHref legacyBehavior>
                        <Button variant="contained" color="primary" size="large" sx={{ py: 2, px: 4 }}>
                            Submit a Track
                        </Button>
                    </Link>
                </Box>
                <Box sx={{ mt: 6 }}>
                    <Link href="/" passHref legacyBehavior>
                        <Button variant="outlined" color="primary">
                            Back to Home
                        </Button>
                    </Link>
                </Box>
            </Container>
        </>
    );
};

export default CompetitionPage;
