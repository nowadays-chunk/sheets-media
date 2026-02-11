import React from 'react';
import Meta from '../../components/Partials/Head';
import { Container, Typography, Box, Button, Paper, Stack } from '@mui/material';
import Link from 'next/link';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

const SubmitTrackPage = () => {
    return (
        <>
            <Meta
                title="Submit Track - Guitar Sheets"
                description="Submit your original composition for the Best Composition contest."
            />
            <Container maxWidth="md" sx={{ mt: 15, mb: 10, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Best Composition
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary" sx={{ mb: 6 }}>
                    Original pieces judged by industry pros.
                </Typography>

                <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Submission Guidelines
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: '600px', mx: 'auto', mb: 4 }}>
                        <ul>
                            <li>Compositions must be original.</li>
                            <li>You can use the Guitar Sheets Composer or any other tool.</li>
                            <li>Export your track as MusicXML or a high-quality audio file.</li>
                        </ul>
                    </Box>

                    <Stack direction="column" spacing={2} alignItems="center">
                        <Button component={Link} href="/compose" variant="outlined" startIcon={<LibraryMusicIcon />} size="large">
                            Open Composer Tool
                        </Button>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body1" paragraph>
                                To enter, simply email us your track details!
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                href="mailto:contest@guitarsheets.com?subject=Best Composition Submission&body=Name:%0D%0AEmail:%0D%0ATrack Title:%0D%0ATrack URL:%0D%0ADescription:"
                            >
                                Submit Track via Email
                            </Button>
                        </Box>
                    </Stack>
                </Paper>

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

export default SubmitTrackPage;
