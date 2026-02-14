import React from 'react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Breadcrumbs,
    Link as MuiLink,
    Chip,
    Avatar,
    Stack,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MainAppBar from '../../Partials/MainAppBar';
import { ThemeProvider, CssBaseline } from '@mui/material';
import globalTheme from '../../../ui/theme';

const ArticleLayout = ({ article, relatedArticles }) => {
    if (!article) return null;

    return (
        <ThemeProvider theme={globalTheme}>
            <CssBaseline />
            <MainAppBar isHomepage={false} />

            <Box sx={{ bgcolor: 'white', pt: 12, pb: 8 }}>
                <Container maxWidth="md">
                    {/* Breadcrumbs & Back Button */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link href="/" passHref>
                                <MuiLink underline="hover" color="inherit">Home</MuiLink>
                            </Link>
                            <Link href="/about" passHref>
                                <MuiLink underline="hover" color="inherit">About</MuiLink>
                            </Link>
                            <Typography color="text.primary">{article.category}</Typography>
                        </Breadcrumbs>
                        <Button
                            component={Link}
                            href="/about"
                            startIcon={<ArrowBackIcon />}
                            variant="text"
                            sx={{ color: 'text.secondary' }}
                        >
                            Back to Articles
                        </Button>
                    </Box>

                    {/* Article Header */}
                    <Box sx={{ mb: 6 }}>
                        <Chip
                            label={article.category}
                            color="primary"
                            size="small"
                            sx={{ mb: 2, fontWeight: 'bold' }}
                        />
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            {article.title}
                        </Typography>

                        <Stack direction="row" spacing={3} sx={{ color: 'text.secondary', mt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2">{article.date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2">{article.readTime} read</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 6 }} />

                    <Box sx={{
                        width: '100%',
                        height: { xs: 300, md: 500 },
                        borderRadius: 6,
                        mb: 6,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        border: '1px solid #eee'
                    }}>
                        <CardMedia
                            component="img"
                            image={article.image}
                            alt={article.title}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>

                    {/* Article Content */}
                    <Box
                        sx={{
                            '& p': { mb: 3, lineHeight: 1.8, fontSize: '1.1rem', color: 'text.secondary' },
                            '& h2': { mt: 6, mb: 3, fontWeight: 'bold' },
                            '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }
                        }}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <Divider sx={{ my: 8 }} />

                    {/* Author Section Placeholder */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 10, p: 4, bgcolor: '#f9f9f9', borderRadius: 4 }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main' }}>GS</Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Guitar Sheets Editorial</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Our editorial team is dedicated to providing high-quality music education and platform insights.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Related Articles */}
                    {relatedArticles && relatedArticles.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                                Keep Reading
                            </Typography>
                            <Grid container spacing={4}>
                                {relatedArticles.map((rel) => (
                                    <Grid item xs={12} sm={6} key={rel.slug}>
                                        <Card sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                        }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    {rel.category}
                                                </Typography>
                                                <Link href={`/about/${rel.slug}`} passHref style={{ textDecoration: 'none' }}>
                                                    <Typography variant="h6" sx={{ mt: 1, mb: 2, color: 'text.primary', fontWeight: 'bold', '&:hover': { color: 'primary.main' } }}>
                                                        {rel.title}
                                                    </Typography>
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">
                                                    {rel.excerpt}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ArticleLayout;
