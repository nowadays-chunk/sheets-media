import React from 'react';
import Meta from '../../components/Partials/Head';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import Link from 'next/link';

const VideoContestPage = () => {

    return (
        <>
            <Meta
                title="Video Contest - Guitar Sheets"
                description="Submit your video for the global guitar challenge!"
            />
            <Container maxWidth="md" sx={{ mt: 15, mb: 10, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Video Contest
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary" sx={{ mb: 6 }}>
                    Show the world what you've got.
                </Typography>

                <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Enter the Contest
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: '600px', mx: 'auto', mb: 4 }}>
                        <ol>
                            <li>Record a video of yourself playing a solo or cover.</li>
                            <li>Upload it to YouTube or Instagram with the tag #GuitarSheetsChallenge.</li>
                            <li>Fill out the submission form below.</li>
                        </ol>
                    </Box>


                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body1" paragraph>
                            To enter, simply email us your submission details!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            href="mailto:contest@guitarsheets.com?subject=Video Contest Submission&body=Name:%0D%0AEmail:%0D%0AVideo URL:%0D%0ADescription:"
                        >
                            Submit via Email
                        </Button>
                    </Box>

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

export default VideoContestPage;
