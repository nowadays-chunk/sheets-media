import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Container,
    Grid,
    Avatar,
    Chip,
    IconButton,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const WinnersRanking = ({ winners }) => {
    const getMedalColor = (rank) => {
        switch (rank) {
            case 1:
                return '#FFD700'; // Gold
            case 2:
                return '#C0C0C0'; // Silver
            case 3:
                return '#CD7F32'; // Bronze
            default:
                return '#90A4AE'; // Gray
        }
    };

    const getMedalIcon = (rank) => {
        return <EmojiEventsIcon sx={{ fontSize: 40, color: getMedalColor(rank) }} />;
    };

    // Group winners by competition
    const competitionGroups = winners.reduce((groups, winner) => {
        const comp = winner.competition;
        if (!groups[comp]) {
            groups[comp] = [];
        }
        groups[comp].push(winner);
        return groups;
    }, {});

    return (
        <Box sx={{ bgcolor: 'background.default', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FF6B6B 30%, #FFD93D 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Hall of Champions
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Celebrating our talented winners
                    </Typography>
                </Box>

                {Object.entries(competitionGroups).map(([competition, compWinners]) => (
                    <Box key={competition} sx={{ mb: 8 }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {competition}
                        </Typography>

                        {/* Podium for top 3 */}
                        <Box sx={{ mb: 6 }}>
                            <Grid container spacing={3} justifyContent="center" alignItems="flex-end">
                                {/* 2nd Place */}
                                {compWinners[1] && (
                                    <Grid item xs={12} sm={4}>
                                        <Card
                                            elevation={6}
                                            sx={{
                                                height: 380,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.3s',
                                                '&:hover': { transform: 'scale(1.05)' },
                                                border: `3px solid ${getMedalColor(2)}`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    pt: 3,
                                                    textAlign: 'center',
                                                    bgcolor: 'background.paper',
                                                }}
                                            >
                                                {getMedalIcon(2)}
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                                    2nd Place
                                                </Typography>
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={compWinners[1].artworkUrl}
                                                alt={compWinners[1].artworkTitle}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {compWinners[1].name}
                                                </Typography>
                                                <Chip
                                                    label={compWinners[1].prize}
                                                    size="small"
                                                    color="secondary"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {/* 1st Place */}
                                {compWinners[0] && (
                                    <Grid item xs={12} sm={4}>
                                        <Card
                                            elevation={10}
                                            sx={{
                                                height: 420,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.3s',
                                                '&:hover': { transform: 'scale(1.05)' },
                                                border: `4px solid ${getMedalColor(1)}`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    pt: 3,
                                                    textAlign: 'center',
                                                    bgcolor: 'background.paper',
                                                }}
                                            >
                                                {getMedalIcon(1)}
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                                                    Champion
                                                </Typography>
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={compWinners[0].artworkUrl}
                                                alt={compWinners[0].artworkTitle}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    {compWinners[0].name}
                                                </Typography>
                                                <Chip
                                                    label={compWinners[0].prize}
                                                    color="primary"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {/* 3rd Place */}
                                {compWinners[2] && (
                                    <Grid item xs={12} sm={4}>
                                        <Card
                                            elevation={6}
                                            sx={{
                                                height: 380,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.3s',
                                                '&:hover': { transform: 'scale(1.05)' },
                                                border: `3px solid ${getMedalColor(3)}`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    pt: 3,
                                                    textAlign: 'center',
                                                    bgcolor: 'background.paper',
                                                }}
                                            >
                                                {getMedalIcon(3)}
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                                    3rd Place
                                                </Typography>
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={compWinners[2].artworkUrl}
                                                alt={compWinners[2].artworkTitle}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {compWinners[2].name}
                                                </Typography>
                                                <Chip
                                                    label={compWinners[2].prize}
                                                    size="small"
                                                    color="secondary"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                        {/* Detailed Winner Cards */}
                        <Grid container spacing={3}>
                            {compWinners.map((winner) => (
                                <Grid item xs={12} md={6} key={winner.id}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6,
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: { xs: '100%', sm: 200 },
                                                height: { xs: 200, sm: 'auto' },
                                            }}
                                            image={winner.artworkUrl}
                                            alt={winner.artworkTitle}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                {getMedalIcon(winner.rank)}
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 'bold', ml: 1 }}
                                                >
                                                    {winner.name}
                                                </Typography>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {winner.bio}
                                            </Typography>

                                            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                                                {winner.description}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{ fontStyle: 'italic', display: 'block', mb: 1 }}
                                            >
                                                "{winner.artworkTitle}"
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {winner.socialMedia?.instagram && (
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        href={`https://instagram.com/${winner.socialMedia.instagram.replace('@', '')}`}
                                                        target="_blank"
                                                    >
                                                        <InstagramIcon />
                                                    </IconButton>
                                                )}
                                                {winner.socialMedia?.youtube && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        href={`https://youtube.com/${winner.socialMedia.youtube.replace('@', '')}`}
                                                        target="_blank"
                                                    >
                                                        <YouTubeIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Container>
        </Box>
    );
};

export default WinnersRanking;
