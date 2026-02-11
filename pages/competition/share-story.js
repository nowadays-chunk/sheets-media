import React from 'react';
import Meta from '../../components/Partials/Head';
import { Container, Typography, Box, Button, Paper, TextField } from '@mui/material';
import Link from 'next/link';
import SchoolIcon from '@mui/icons-material/School';

const ShareStoryPage = () => {
    return (
        <>
            <Meta
                title="Share Your Story - Guitar Sheets"
                description="Inspire others by sharing your guitar learning or teaching journey."
            />
            <Container maxWidth="md" sx={{ mt: 15, mb: 10, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Share Your Story
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary" sx={{ mb: 6 }}>
                    Every guitarist has a journey. What's yours?
                </Typography>

                <Paper elevation={3} sx={{ p: 5, borderRadius: 4, textAlign: 'left' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Tell Us Your Story
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Whether you're a self-taught prodigy, a dedicated teacher, or someone who just picked up the guitar later in life, your story matters.
                        Share your experiences, challenges, and improved moments. Selected stories will be featured on our blog and newsletter.
                    </Typography>

                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
                        <TextField
                            fullWidth
                            label="Your Name"
                            variant="outlined"
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            margin="normal"
                            required
                            type="email"
                        />
                        <TextField
                            fullWidth
                            label="Title of Your Story"
                            variant="outlined"
                            margin="normal"
                            placeholder="e.g., How I finally conquered the F chord"
                        />
                        <TextField
                            fullWidth
                            label="Your Story"
                            variant="outlined"
                            margin="normal"
                            required
                            multiline
                            rows={6}
                            placeholder="Start typing your story here..."
                        />

                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            <Button variant="contained" color="success" size="large">
                                Submit Story
                            </Button>
                        </Box>
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

export default ShareStoryPage;
