import React, { useState } from 'react';
import Meta from '../../components/Partials/Head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Button,
    Box,
    Chip,
    Paper,
    Divider,
    Breadcrumbs,
    Rating
} from '@mui/material';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addToCart, toggleCart } from '../../redux/actions/cartActions';
import products from '../../data/products.json'; // Direct import since we use getStaticProps

const ProductPage = ({ product }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    if (router.isFallback) {
        return <Container sx={{ py: 10 }}>Loading...</Container>;
    }

    if (!product) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4">Product not found</Typography>
                <Button component={Link} href="/#store" sx={{ mt: 2 }}>Back to Store</Button>
            </Container>
        );
    }

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        dispatch(toggleCart());
    };

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 10 }}>
            <Meta
                title={`${product.title} | Guitar Sheets Store`}
                description={product.description || `Buy ${product.title} - ${product.type} guitar sheet music and learning materials. Instant delivery, high quality format, secure checkout.`}
            />

            <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
                {/* Breadcrumbs */}
                <Box sx={{ mb: 4 }}>
                    <Button startIcon={<ArrowBackIcon />} component={Link} href="/#store" sx={{ mb: 2, color: 'text.secondary' }}>
                        Back to Store
                    </Button>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <Link href="/" color="inherit" style={{ textDecoration: 'none', color: 'gray' }}>
                            Home
                        </Link>
                        <Link href="/#store" color="inherit" style={{ textDecoration: 'none', color: 'gray' }}>
                            Store
                        </Link>
                        <Typography color="text.primary">{product.title}</Typography>
                    </Breadcrumbs>
                </Box>

                <Grid container spacing={6}>
                    {/* Product Image */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{
                            position: 'relative',
                            height: 400,
                            bgcolor: '#f5f5f5',
                            borderRadius: 4,
                            overflow: 'hidden',
                            border: '1px solid #eee'
                        }}>
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    style={{ objectFit: 'contain', padding: '2rem' }}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">No Image</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={product.type}
                                color={product.type === 'Digital' ? 'primary' : 'secondary'}
                                size="small"
                                sx={{ mb: 2, borderRadius: 1 }}
                            />
                            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                                {product.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Rating value={5} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">(12 reviews)</Typography>
                            </Box>
                        </Box>

                        <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ mb: 4 }}>
                            ${product.price}
                        </Typography>

                        <Typography variant="body1" paragraph sx={{ fontSize: '1.rem', lineHeight: 1.8, color: 'text.secondary', mb: 4 }}>
                            {product.description}
                        </Typography>

                        <Divider sx={{ mb: 4 }} />

                        {/* Features List (Mock) */}
                        <Box sx={{ mb: 4 }}>
                            {['Instant Delivery', 'High Quality Format', 'Secure Checkout'].map((feature, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <CheckCircleIcon sx={{ color: 'success.main', mr: 2, fontSize: 20 }} />
                                    <Typography variant="body2">{feature}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                sx={{ px: 4, py: 1.5, flexGrow: { xs: 1, md: 0 } }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export async function getStaticPaths() {
    const paths = products.map((product) => ({
        params: { id: product.id },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const product = products.find((p) => p.id === params.id);
    return { props: { product } };
}

export default ProductPage;
