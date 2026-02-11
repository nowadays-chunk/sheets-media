import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Image from 'next/image';

const ProductCard = ({ title, price, image, type }) => (
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
            <Box sx={{
                height: 200,
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#f5f5f5'
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
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="contained" color="secondary" startIcon={<ShoppingCartIcon />}>
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    </Grid>
);

export default ProductCard;
