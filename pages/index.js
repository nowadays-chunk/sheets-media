"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Box,
    useTheme,
    ThemeProvider,
    CssBaseline,
    Divider,
    Stack,
    Avatar,
    Paper,
    Chip
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SchoolIcon from '@mui/icons-material/School';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import TableChartIcon from '@mui/icons-material/TableChart';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MainAppBar from '../components/Partials/MainAppBar';
import globalTheme from '../ui/theme'; // Use the newly created theme
import products from '../data/products.json';
import { addToCart } from '../redux/actions/cartActions';
import { toggleCart } from '../redux/actions/cartActions';
import { DEFAULT_KEYWORDS } from '../data/seo';
import { aboutArticles } from '../data/aboutArticles';
import PlayWizard from '../components/Play/PlayWizard';
import guitar from '../config/guitar';
import { updateStateProperty, newFretboard, addFretboard } from '../redux/actions';
import { useRouter } from 'next/router';

export const getStaticProps = async (context) => {
    // Logic from /play page to generate elements
    const elements = guitar.notes.sharps.flatMap((key) => {
        const chords = Object.keys(guitar.arppegios).map((chordKey) => {
            const title = `Chord: ${guitar.arppegios[chordKey].name} in ${key}`;
            return {
                label: title,
                href: `/spreading/chords/${key.replace('#', 'sharp')}/${chordKey.replace('#', 'sharp')}`,
            };
        });

        const arpeggios = Object.keys(guitar.arppegios).flatMap((arppegioKey) => {
            const title = `Arpeggio: ${guitar.arppegios[arppegioKey].name} in ${key}`;
            return [
                {
                    label: title,
                    href: `/spreading/arppegios/${key.replace('#', 'sharp')}/${arppegioKey.replace('#', 'sharp')}`,
                },
            ];
        });

        const scales = Object.keys(guitar.scales).flatMap((scaleKey) => {
            if (guitar.scales[scaleKey].isModal === true) {
                return [
                    ...guitar.scales[scaleKey].modes.map((mode) => {
                        const title = `Scale: ${guitar.scales[scaleKey].name} in ${key} (Mode: ${mode.name})`;
                        return {
                            label: title,
                            href: `/spreading/scales/${key.replace('#', 'sharp')}/${scaleKey}/modal/${decodeURIComponent(mode.name.toLowerCase().replace(' ', '-')).replace('#', 'sharp')}`,
                        };
                    }),
                ];
            } else {
                const title = `Scale: ${guitar.scales[scaleKey].name} in ${key} (Single)`;
                return [
                    {
                        label: title,
                        href: `/spreading/scales/${key.replace('#', 'sharp')}/${scaleKey}/single`,
                    },
                ];
            }
        });

        return [...chords, ...arpeggios, ...scales];
    });

    return {
        props: {
            elements,
            articles: aboutArticles,
        },
        revalidate: 60,
    };
};

// --- Reusable Components ---

const FeatureCard = ({ title, description, icon, link, buttonText, color }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderTop: `4px solid ${color}`,
            bgcolor: '#fff',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                borderColor: color
            }
        }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: color, mb: 2 }}>
                    {icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button component={Link} href={link} variant="outlined" sx={{ color: color, borderColor: color, '&:hover': { borderColor: color, bgcolor: `${color}10` } }}>
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    </Grid>
);

const SectionHeader = ({ title, subtitle }) => (
    <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h2" sx={{ mb: 2, fontWeight: 800 }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontWeight: 300 }}>
                {subtitle}
            </Typography>
        )}
        <Box sx={{ width: '60px', height: '4px', bgcolor: 'primary.main', mx: 'auto', mt: 3, borderRadius: 2 }} />
    </Box>
);

const ProductCard = ({ id, title, price, image, type }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ id, title, price, image, type }));
        dispatch(toggleCart());
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <Chip label={type} size="small" color={type === 'Physical' ? 'secondary' : 'primary'} />
                </Box>
                <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{
                        height: 200,
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: '#f5f5f5',
                        cursor: 'pointer'
                    }}>
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <Box sx={{
                                height: '100%',
                                background: type === 'Physical' ? 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)'
                                }} />
                                {type === 'Physical' ?
                                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} /> :
                                    <LibraryMusicIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.3 }} />
                                }
                            </Box>
                        )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" sx={{ fontSize: '1rem' }}>
                            {title}
                        </Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                            ${price}
                        </Typography>
                    </CardContent>
                </Link>
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button fullWidth variant="contained" color="secondary" startIcon={<ShoppingCartIcon />} onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

const TestimonialCard = ({ name, role, text, rating }) => (
    <Grid item xs={12} md={4}>
        <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid #eee', borderRadius: 4, bgcolor: '#fafafa' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: i < rating ? '#ffb300' : '#e0e0e0', fontSize: 20 }} />
                ))}
            </Box>
            <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                "{text}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar char={name[0]} sx={{ bgcolor: 'secondary.main' }}>{name[0]}</Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {role}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    </Grid>
);

// --- Main Page Component ---

const ProjectFunctionalities = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [view, setView] = useState('wizard');
    const [randomizedArticles, setRandomizedArticles] = useState([]);
    const [featuredArticle, setFeaturedArticle] = useState(null);

    // Find the active fretboard for this page (play)
    const fretboards = useSelector(state => state.fretboard.components);
    const activeFretboard = fretboards.find(b => b.generalSettings.page === 'play');

    useEffect(() => {
        if (props.articles && props.articles.length > 0) {
            const shuffled = [...props.articles].sort(() => 0.5 - Math.random());
            setFeaturedArticle(shuffled[0]);
            // Limit to 4 additional randomized articles for the grid
            setRandomizedArticles(shuffled.slice(1, 5));
        }
    }, [props.articles]);

    const handleSelect = (selection) => {
        let boardId = activeFretboard?.id;

        if (!boardId) {
            // Create new board for the 'play' page (logic from original /play)
            const newBoard = newFretboard(
                6,
                25,
                [4, 7, 2, 9, 11, 4],
                [4, 3, 3, 3, 2, 2],
                'play',
                selection.type
            );
            dispatch(addFretboard(newBoard));
            boardId = newBoard.id;
        }

        // Dispatch selection to Redux
        if (boardId) {
            dispatch(updateStateProperty(boardId, "generalSettings.choice", selection.type));
            dispatch(updateStateProperty(boardId, "keySettings." + selection.type, selection.key));

            if (selection.type === 'scale') {
                dispatch(updateStateProperty(boardId, "scaleSettings.scale", selection.value));
                if (selection.mode !== undefined && guitar.scales[selection.value]) {
                    const modeName = guitar.scales[selection.value].modes[selection.mode].name;
                    dispatch(updateStateProperty(boardId, "modeSettings.mode", modeName));
                }
            } else if (selection.type === 'chord') {
                dispatch(updateStateProperty(boardId, "chordSettings.chord", selection.value));
            } else if (selection.type === 'arppegio') {
                dispatch(updateStateProperty(boardId, "arppegioSettings.arppegio", selection.value));
            }

            if (selection.shape) {
                dispatch(updateStateProperty(boardId, selection.type + "Settings.shape", selection.shape));
            }
        }

        if (selection.href) {
            router.push(selection.href);
        } else {
            // Scroll to the top or to the app visualization section if integrated
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <ThemeProvider theme={globalTheme}>
            <CssBaseline />
            <Head>
                <title>Guitar Sheets & Music Store | Learn, Play & Compose</title>
                <meta
                    name="keywords"
                    content={DEFAULT_KEYWORDS}
                />
                <meta
                    name="description"
                    content="The ultimate guitar platform. Master chords and scales with interactive tools, buy exclusive merchandise and sheet music, compose your own music, and join our global community competitions."
                />
            </Head>

            {/* Navigation Bar */}
            <MainAppBar isHomepage={true} />

            {/* Hero Section */}
            <Box sx={{
                bgcolor: 'white',
                pt: 15,
                pb: 15,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                {/* Abstract Background Shapes - Subtle & Clean */}
                <Box sx={{
                    position: 'absolute',
                    top: -150,
                    right: -150,
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    bgcolor: 'rgba(33, 150, 243, 0.03)', // Very subtle blue
                    zIndex: 0,
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    bgcolor: 'rgba(244, 67, 54, 0.03)', // Very subtle red
                    zIndex: 0,
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, mb: 3 }}>
                        Master Every <Box component="span" sx={{ color: 'primary.main' }}>Fret</Box>
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 5, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
                        The definitive platform for modern guitarists. Visualize theory, compose masterpieces, and verify your skills with our advanced tools.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button component="a" href="#play-wizard" variant="contained" size="large" color="primary" startIcon={<PlayCircleOutlineIcon />} sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
                            Interactive Player
                        </Button>
                        <Button component="a" href="#projects" variant="outlined" size="large" color="secondary" startIcon={<LibraryMusicIcon />} sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
                            Explore Tools
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Play Wizard Section */}
            <Box id="play-wizard" sx={{ bgcolor: '#fafafa', py: 10 }}>
                <Container maxWidth="xl">
                    <SectionHeader title="Play & Master" subtitle="Select a scale, chord, or arpeggio to visualize it on the interactive fretboard." />
                    <PlayWizard elements={props.elements} onSelect={handleSelect} />
                </Container>
            </Box>

            {/* Project Portfolio Showcase */}
            <Box id="projects" sx={{ bgcolor: 'white', py: 12 }}>
                <Container maxWidth="xl">
                    <SectionHeader title="Our Ecosystem" subtitle="A comprehensive suite of tools for the modern musician." />
                    <Grid container spacing={4}>
                        <FeatureCard
                            title="Composer"
                            description="Craft soulful arrangements with our advanced chord and progression tools."
                            icon={<LibraryMusicIcon sx={{ fontSize: 48 }} />}
                            link="/compose"
                            buttonText="Go to Composer"
                            color="#f44336"
                        />
                        <FeatureCard
                            title="Learning Lab"
                            description="Master theory through structured paths and interactive song lessons."
                            icon={<SchoolIcon sx={{ fontSize: 48 }} />}
                            link="/learn"
                            buttonText="Start Learning"
                            color="#2196f3"
                        />
                        <FeatureCard
                            title="Latest News"
                            description="Stay updated with industry trends, tutorials, and community spotlights."
                            icon={<AppRegistrationIcon sx={{ fontSize: 48 }} />}
                            link="/news"
                            buttonText="Read News"
                            color="#4caf50"
                        />
                        <FeatureCard
                            title="Theory Tables"
                            description="Quick reference for scales and chords across all keys and modes."
                            icon={<TableChartIcon sx={{ fontSize: 48 }} />}
                            link="/tables"
                            buttonText="View Tables"
                            color="#ff9800"
                        />
                        <FeatureCard
                            title="Circle of Fifths"
                            description="Visualize harmonic relationships and key signatures instantly."
                            icon={<ChangeHistoryIcon sx={{ fontSize: 48 }} />}
                            link="/circle"
                            buttonText="Launch Circle"
                            color="#9c27b0"
                        />
                        <FeatureCard
                            title="Performance Stats"
                            description="Track your growth and analyze your playing patterns with deep analytics."
                            icon={<ShowChartIcon sx={{ fontSize: 48 }} />}
                            link="/stats"
                            buttonText="View Statistics"
                            color="#607d8b"
                        />
                        <FeatureCard
                            title="Music Store"
                            description="Premium gear, exclusive sheet music, and custom merchandise."
                            icon={<ShoppingCartIcon sx={{ fontSize: 48 }} />}
                            link="/store"
                            buttonText="Visit Store"
                            color="#ff5722"
                        />
                        <FeatureCard
                            title="Competitions"
                            description="Test your skills against the world and win exclusive rewards."
                            icon={<EmojiEventsIcon sx={{ fontSize: 48 }} />}
                            link="/competition"
                            buttonText="Join Challenges"
                            color="#ffc107"
                        />
                    </Grid>
                </Container>
            </Box>

            {/* Featured Articles Section */}
            <Box id="articles" sx={{ bgcolor: '#fafafa', py: 12 }}>
                <Container maxWidth="xl">
                    <SectionHeader title="Insights & Inspiration" subtitle="Deep dives into the world of guitar and music theory." />

                    <Grid container spacing={4}>
                        {/* Randomized Featured Large Card */}
                        {featuredArticle && (
                            <Grid item xs={12}>
                                <Card sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: 8,
                                    bgcolor: 'white'
                                }}>
                                    <Box sx={{ width: { xs: '100%', md: '50%' }, height: 400, position: 'relative' }}>
                                        {featuredArticle.image ? (
                                            <Image
                                                src={featuredArticle.image}
                                                alt={featuredArticle.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ height: '100%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h3" color="white" fontWeight="bold">ARTICLE</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: { xs: 4, md: 8 }, width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography variant="overline" color="primary" fontWeight="bold" gutterBottom>FEATURED ARTICLE</Typography>
                                        <Typography variant="h3" component="h2" gutterBottom fontWeight="black" sx={{ mb: 3 }}>
                                            {featuredArticle.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.2rem', mb: 4 }}>
                                            {featuredArticle.excerpt}
                                        </Typography>
                                        <Box>
                                            <Button component={Link} href={`/learn/${featuredArticle.slug}`} variant="contained" size="large" color="primary" sx={{ px: 6 }}>
                                                Read Full Story
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* Randomized Order for remaining articles with varied sizes */}
                        {randomizedArticles.map((article, index) => {
                            // Varied sizes: 1st and 4th are larger (md=8), 2nd and 3rd are smaller (md=4)
                            // This creates a nice asymmetrical grid
                            const isLarge = index === 0 || index === 3;
                            return (
                                <Grid item xs={12} md={isLarge ? 8 : 4} key={article.slug}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: isLarge ? { xs: 'column', sm: 'row' } : 'column',
                                        borderRadius: 4,
                                        transition: 'all 0.3s ease',
                                        overflow: 'hidden',
                                        border: '1px solid #eee',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: 6,
                                            borderColor: 'primary.main'
                                        }
                                    }}>
                                        <Box sx={{
                                            width: isLarge ? { xs: '100%', sm: '40%' } : '100%',
                                            height: isLarge ? { xs: 200, sm: '100%' } : 200,
                                            position: 'relative'
                                        }}>
                                            {article.image ? (
                                                <Image
                                                    src={article.image}
                                                    alt={article.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Box sx={{ height: '100%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <LibraryMusicIcon sx={{ fontSize: 40, color: '#ccc' }} />
                                                </Box>
                                            )}
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: isLarge ? { xs: '100%', sm: '60%' } : '100%',
                                            p: 3
                                        }}>
                                            <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                                                    {article.category || 'Music Theory'}
                                                </Typography>
                                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 1 }}>
                                                    {article.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: isLarge ? 4 : 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {article.excerpt}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ p: 0, mt: 'auto' }}>
                                                <Button
                                                    component={Link}
                                                    href={`/learn/${article.slug}`}
                                                    color="primary"
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Read Article
                                                </Button>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Button
                            component={Link}
                            href="/about"
                            variant="outlined"
                            size="large"
                            sx={{
                                borderRadius: 10,
                                px: 5,
                                py: 1.5,
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Explore All Articles & Vision
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Store Section */}
            <Box id="store" sx={{ bgcolor: 'white', py: 12 }}>
                <Container maxWidth="xl">
                    <SectionHeader title="Master The Guitar Store" subtitle="Exclusive merchandise, premium PDFs, custom picks, and sheet music." />

                    <Grid container spacing={4}>
                        {products.slice(0, 8).map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                type={product.type}
                                image={product.image}
                            />
                        ))}
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button component={Link} href="/store" variant="outlined" size="large" endIcon={<ShoppingCartIcon />}>View All Products</Button>
                    </Box>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ bgcolor: '#fafafa', py: 12 }}>
                <Container maxWidth="lg">
                    <SectionHeader title="Community Stories" subtitle="Join thousands of guitarists who have elevated their playing." />
                    <Grid container spacing={4}>
                        <TestimonialCard
                            name="Alex Chen"
                            role="Session Guitarist"
                            rating={5}
                            text="The visualization tools completely changed how I understand modes. I can finally improvise with confidence across the entire neck."
                        />
                        <TestimonialCard
                            name="Sarah Johnson"
                            role="Music Teacher"
                            rating={5}
                            text="I use this platform with all my students. It simplifies complex theory into visual concepts that just click. Highly recommended."
                        />
                        <TestimonialCard
                            name="Marcus Davis"
                            role="Bedroom Producer"
                            rating={4}
                            text="Great for composing! Being able to quickly see compatible chords and scales speeds up my workflow immensely."
                        />
                    </Grid>
                </Container>
            </Box>

            {/* Competitions Section */}
            <Box id="competitions" sx={{ bgcolor: '#111', color: 'white', py: 12, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'linear-gradient(45deg, #2196f3 0%, #f44336 100%)' }} />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <EmojiEventsIcon sx={{ fontSize: 80, color: '#ffb300', mb: 2 }} />
                        <Typography variant="h2" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 800 }}>
                            Global Guitar Challenges
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', mx: 'auto', fontWeight: 300 }}>
                            Showcase your talent. Win featured spots, gear, and recognition. Submit your videos, stories, and original compositions.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                    <MovieIcon sx={{ fontSize: 50, color: '#2196f3', mb: 2 }} />
                                    <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>Video Contest</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                        Submit your best solo or cover. Monthly winners get featured on our homepage.
                                    </Typography>
                                    <Button component={Link} href="/competition/video-contest" variant="contained" color="primary">Enter Now</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                    <LibraryMusicIcon sx={{ fontSize: 50, color: '#f44336', mb: 2 }} />
                                    <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>Best Composition</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                        Original pieces judged by industry pros. Win studio gear and software licenses.
                                    </Typography>
                                    <Button component={Link} href="/competition/submit-track" variant="contained" color="secondary">Submit Track</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                    <SchoolIcon sx={{ fontSize: 50, color: '#4caf50', mb: 2 }} />
                                    <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>Teaching Story</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                        Share your journey of learning or teaching. Inspire others with your documentary or blog.
                                    </Typography>
                                    <Button component={Link} href="/competition/share-story" variant="text" sx={{ color: 'white' }}>Share Story &rarr;</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'white', py: 8, borderTop: '1px solid #eee' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-between">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
                                GUITAR SHEETS
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '300px' }}>
                                Join our mission to democratize music theory and empower guitarists worldwide through technology and community.
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Product</Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="#play-wizard" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Interactive Player</Typography></Box>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/compose" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Composer</Typography></Box>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/store" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Store</Typography></Box>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/about" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>About</Typography></Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Community</Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="#competitions" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Competitions</Typography></Box>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/blog" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Stories</Typography></Box>
                                <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/forum" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Forum</Typography></Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                                <Button component={Link} href="/privacy" color="inherit" size="small">Privacy</Button>
                                <Button component={Link} href="/terms" color="inherit" size="small">Terms</Button>
                                <Button component={Link} href="/contact" color="inherit" size="small">Contact</Button>
                            </Stack>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                                © {new Date().getFullYear()} Guitar Sheets Media.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ProjectFunctionalities;
