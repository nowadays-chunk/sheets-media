import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import {
    Container,
    Grid,
    Box,
    Typography,
    Breadcrumbs,
    Button,
    useMediaQuery,
    Drawer,
    IconButton,
} from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ProductFilters from '../../components/Store/ProductFilters';
import ProductGrid from '../../components/Store/ProductGrid';
import CategoryNavbar from '../../components/Store/CategoryNavbar';
import productsData from '../../data/products.json';

export async function getStaticProps() {
    return {
        props: {
            products: productsData,
        },
    };
}

const StorePage = ({ products }) => {
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState('all');
    const [productType, setProductType] = useState('all');
    const [sortBy, setSortBy] = useState('featured');

    // Mobile drawer state
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    // Category count for badges
    const categoryCount = useMemo(() => {
        const counts = {};
        products.forEach((product) => {
            counts[product.category] = (counts[product.category] || 0) + 1;
        });
        return counts;
    }, [products]);

    // Filter logic
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) =>
                selectedCategories.includes(product.category)
            );
        }

        // Price range filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange === '50+'
                ? [50, Infinity]
                : priceRange.split('-').map(Number);

            filtered = filtered.filter((product) => {
                if (max === undefined) {
                    return product.price >= min;
                }
                return product.price >= min && product.price < max;
            });
        }

        // Product type filter
        if (productType !== 'all') {
            filtered = filtered.filter((product) => product.type === productType);
        }

        return filtered;
    }, [products, searchTerm, selectedCategories, priceRange, productType]);

    // Sort logic
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'featured':
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    // Handler functions
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setPriceRange('all');
        setProductType('all');
    };

    const filterComponent = (
        <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            productType={productType}
            onProductTypeChange={setProductType}
            onClearFilters={handleClearFilters}
            categoryCount={categoryCount}
            totalProducts={sortedProducts.length}
        />
    );

    return (
        <>
            <Head>
                <title>Guitar Sheets Store | Premium Music Gear & Resources</title>
                <meta name="description" content="Shop premium guitar gear, sheet music, and accessories. Enhance your playing with our curated collection." />
                <meta name="keywords" content={DEFAULT_KEYWORDS} />
            </Head>

            <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
                {/* Breadcrumbs */}
                <Box sx={{ mb: 2 }}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                    >
                        <Link
                            href="/"
                            style={{ textDecoration: 'none', color: 'gray' }}
                        >
                            Home
                        </Link>
                        <Typography color="text.primary">Store</Typography>
                    </Breadcrumbs>
                </Box>

                {/* Category Navbar */}
                <CategoryNavbar
                    products={products}
                    selectedCategories={selectedCategories}
                    selectedType={productType}
                    onCategoryClick={handleCategoryChange}
                    onTypeClick={setProductType}
                />

                {/* Mobile Filter Button */}
                {isMobile && (
                    <Box sx={{ mb: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setMobileFiltersOpen(true)}
                        >
                            Filters & Sort
                        </Button>
                    </Box>
                )}

                {/* Main Content */}
                <Grid container spacing={4}>
                    {/* Sidebar Filters - Desktop */}
                    {!isMobile && (
                        <Grid item xs={12} md={3}>
                            {filterComponent}
                        </Grid>
                    )}

                    {/* Product Grid */}
                    <Grid item xs={12} md={9}>
                        <ProductGrid
                            products={sortedProducts}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                    </Grid>
                </Grid>

                {/* Mobile Filters Drawer */}
                <Drawer
                    anchor="left"
                    open={mobileFiltersOpen}
                    onClose={() => setMobileFiltersOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '85%',
                            maxWidth: 360,
                            p: 2,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Filters
                        </Typography>
                        <IconButton onClick={() => setMobileFiltersOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {filterComponent}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => setMobileFiltersOpen(false)}
                    >
                        View Products
                    </Button>
                </Drawer>
            </Container>
        </>
    );
};

export default StorePage;
