import React, { useState } from 'react';
import {
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Dialog,
    IconButton,
    Typography,
    Container,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image';

const ArtworkGallery = ({ winners }) => {
    const [open, setOpen] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpen = (winner) => {
        setSelectedWinner(winner);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWinner(null);
    };

    const getCols = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Artwork Gallery
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Masterpieces from our talented winners
                    </Typography>
                </Box>

                <ImageList
                    cols={getCols()}
                    gap={16}
                    sx={{
                        mb: 0,
                    }}
                >
                    {winners.map((winner) => (
                        <ImageListItem
                            key={winner.id}
                            sx={{
                                cursor: 'pointer',
                                overflow: 'hidden',
                                borderRadius: 2,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 6,
                                    '& .MuiImageListItemBar-root': {
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)',
                                    },
                                },
                            }}
                            onClick={() => handleOpen(winner)}
                        >
                            <Image
                                src={winner.artworkUrl}
                                alt={winner.artworkTitle}
                                width={500}
                                height={300}
                                style={{
                                    height: 300,
                                    objectFit: 'cover',
                                    width: '100%',
                                }}
                            />
                            <ImageListItemBar
                                title={winner.artworkTitle}
                                subtitle={`by ${winner.name}`}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                        aria-label={`info about ${winner.artworkTitle}`}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                }
                                sx={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    transition: 'background 0.3s',
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>

                {/* Lightbox Dialog */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            bgcolor: 'background.default',
                            backgroundImage: 'none',
                        },
                    }}
                >
                    {selectedWinner && (
                        <Box sx={{ position: 'relative' }}>
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: 'white',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    zIndex: 1,
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '70vh',
                                    bgcolor: 'black',
                                }}
                            >
                                <Image
                                    src={selectedWinner.artworkUrl}
                                    alt={selectedWinner.artworkTitle}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {selectedWinner.artworkTitle}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    by {selectedWinner.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {selectedWinner.bio}
                                </Typography>
                                <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                                    {selectedWinner.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Competition: {selectedWinner.competition}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Rank: #{selectedWinner.rank}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Prize: {selectedWinner.prize}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Dialog>
            </Container>
        </Box>
    );
};

export default ArtworkGallery;
