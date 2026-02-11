import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Button,
    Container,
} from '@mui/material';
import Link from 'next/link';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { format } from 'date-fns';

const TournamentSchedule = ({ tournaments }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming':
                return 'primary';
            case 'ongoing':
                return 'success';
            case 'completed':
                return 'default';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
    const completedTournaments = tournaments.filter(t => t.status === 'completed');

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Tournament Schedule
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Compete with guitarists worldwide
                </Typography>
            </Box>

            {/* Upcoming Tournaments */}
            {upcomingTournaments.length > 0 && (
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
                    >
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Upcoming Tournaments
                    </Typography>
                    <Grid container spacing={3}>
                        {upcomingTournaments.map((tournament) => (
                            <Grid item xs={12} md={6} key={tournament.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={tournament.status.toUpperCase()}
                                                color={getStatusColor(tournament.status)}
                                                size="small"
                                            />
                                            <Chip
                                                label={tournament.prizePool}
                                                color="secondary"
                                                icon={<EmojiEventsIcon />}
                                                size="small"
                                            />
                                        </Box>

                                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {tournament.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            <EventIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                                        </Typography>

                                        <Typography variant="body2" paragraph>
                                            {tournament.description}
                                        </Typography>

                                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {tournament.categories.map((category, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={category}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>

                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Link href={`/competition/tournaments/${tournament.id}`} passHref legacyBehavior>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                color="primary"
                                            >
                                                View Details & Register
                                            </Button>
                                        </Link>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Past Tournaments */}
            {completedTournaments.length > 0 && (
                <Box>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
                    >
                        <EmojiEventsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        Past Tournaments
                    </Typography>
                    <Grid container spacing={3}>
                        {completedTournaments.map((tournament) => (
                            <Grid item xs={12} md={6} key={tournament.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        opacity: 0.9,
                                        transition: 'opacity 0.3s',
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label="COMPLETED"
                                                color={getStatusColor(tournament.status)}
                                                size="small"
                                            />
                                            <Chip
                                                label={tournament.prizePool}
                                                color="default"
                                                icon={<EmojiEventsIcon />}
                                                size="small"
                                            />
                                        </Box>

                                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {tournament.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            <EventIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                                        </Typography>

                                        <Typography variant="body2" paragraph>
                                            {tournament.description}
                                        </Typography>
                                    </CardContent>

                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Link href={`/competition/tournaments/${tournament.id}`} passHref legacyBehavior>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                color="primary"
                                            >
                                                View Results
                                            </Button>
                                        </Link>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default TournamentSchedule;
