import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Button,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import Link from 'next/link';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import { format } from 'date-fns';

const TournamentDetails = ({ tournament }) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

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

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Chip
                    label={tournament.status.toUpperCase()}
                    color={getStatusColor(tournament.status)}
                    sx={{ mb: 2 }}
                />
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {tournament.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    {tournament.description}
                </Typography>
            </Box>

            {/* Tournament Info */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Tournament Dates
                            </Typography>
                        </Box>
                        <Typography variant="body1" gutterBottom>
                            <strong>Start:</strong> {formatDate(tournament.startDate)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>End:</strong> {formatDate(tournament.endDate)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Registration Deadline:</strong>{' '}
                            {formatDate(tournament.registrationDeadline)}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EmojiEventsIcon sx={{ mr: 1, color: 'secondary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Prize Pool
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            {tournament.prizePool}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Distributed among top performers
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Categories */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Categories
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tournament.categories.map((category, idx) => (
                        <Chip
                            key={idx}
                            label={category}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Paper>

            {/* Rules */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Rules & Requirements
                </Typography>
                <List>
                    {tournament.rules.map((rule, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={rule} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                {tournament.status === 'upcoming' && (
                    <>
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            href={`mailto:contest@guitarsheets.com?subject=Registration for ${tournament.name}&body=Name:%0D%0AEmail:%0D%0ACategory:%0D%0APerformance Description:`}
                            startIcon={<EmailIcon />}
                            sx={{ mr: 2, mb: 2 }}
                        >
                            Register Now
                        </Button>
                        <Link href="/competition/submit-track" passHref legacyBehavior>
                            <Button
                                variant="outlined"
                                size="large"
                                color="secondary"
                                sx={{ mb: 2 }}
                            >
                                Submit Your Track
                            </Button>
                        </Link>
                    </>
                )}
                {tournament.status === 'completed' && (
                    <Typography variant="h6" color="text.secondary">
                        This tournament has ended. Check out the winners below!
                    </Typography>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Back Button */}
            <Box sx={{ textAlign: 'center' }}>
                <Link href="/competition" passHref legacyBehavior>
                    <Button variant="outlined" color="primary">
                        Back to Competitions
                    </Button>
                </Link>
            </Box>
        </Container>
    );
};

export default TournamentDetails;
