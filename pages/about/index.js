import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    Button,
    Chip,
    Stack,
    Divider,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import MainAppBar from '../../components/Partials/MainAppBar';
import globalTheme from '../../ui/theme';
import { aboutArticles } from '../../data/aboutArticles';
import { DEFAULT_KEYWORDS } from '../../data/seo';

const AboutPage = () => {
    return (
        <ThemeProvider theme={globalTheme}>
            <CssBaseline />
            <Head>
                <title>About Us | Guitar Sheets Platform</title>
                <meta name="description" content="Learn more about our mission, vision, and the tools we build for the global guitar community." />
                <meta name="keywords" content={DEFAULT_KEYWORDS} />
            </Head>

            <MainAppBar isHomepage={false} />

            {/* Hero Section */}
            <Box sx={{
                bgcolor: 'primary.main',
                color: 'white',
                pt: { xs: 15, md: 20 },
                pb: { xs: 10, md: 15 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Subtle decorative elements */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    left: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)'
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: -50,
                    right: -50,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)'
                }} />

                <Container maxWidth="md">
                    <Typography variant="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '3rem', md: '4.5rem' } }}>
                        About Our Platform
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300, maxWidth: '700px', mx: 'auto' }}>
                        Discover our mission to empower musicians through technology, community, and expert knowledge.
                    </Typography>
                </Container>
            </Box>

            {/* Articles Grid */}
            <Box sx={{ py: 12, bgcolor: '#fafafa' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        {aboutArticles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.slug}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={article.image}
                                        alt={article.title}
                                        sx={{ bgcolor: '#eee' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Chip
                                                label={article.category}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {article.readTime}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                                            {article.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {article.excerpt}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 4, pt: 0 }}>
                                        <Button
                                            component={Link}
                                            href={`/about/${article.slug}`}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Read Article
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Newsletter / CTA Section */}
            <Box sx={{ bgcolor: 'white', py: 12 }}>
                <Container maxWidth="md">
                    <Card sx={{
                        bgcolor: '#111',
                        color: 'white',
                        borderRadius: 6,
                        p: { xs: 4, md: 8 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'linear-gradient(45deg, #2196f3 0%, #f44336 100%)' }} />
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Join the Evolution
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.7, maxWidth: '600px', mx: 'auto' }}>
                                Stay updated with our latest tools, tutorials, and community news.
                            </Typography>
                            <Button variant="contained" size="large" color="secondary" sx={{ px: 6 }}>
                                Subscribe to Newsletter
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'white', py: 8, borderTop: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Guitar Sheets Media. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AboutPage;
