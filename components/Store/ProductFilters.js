import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Button,
    Divider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Badge,
    Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ClearIcon from '@mui/icons-material/Clear';

const ProductFilters = ({
    searchTerm,
    onSearchChange,
    selectedCategories,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    productType,
    onProductTypeChange,
    onClearFilters,
    categoryCount,
    totalProducts,
}) => {
    const categories = [
        { value: 'Sheet Music', label: 'Sheet Music', count: categoryCount['Sheet Music'] || 0 },
        { value: 'Learning Materials', label: 'Learning Materials', count: categoryCount['Learning Materials'] || 0 },
        { value: 'Merchandise', label: 'Merchandise', count: categoryCount['Merchandise'] || 0 },
        { value: 'Accessories', label: 'Accessories', count: categoryCount['Accessories'] || 0 },
    ];

    const priceRanges = [
        { value: 'all', label: 'All Prices' },
        { value: '0-15', label: 'Under $15' },
        { value: '15-30', label: '$15 - $30' },
        { value: '30-50', label: '$30 - $50' },
        { value: '50+', label: '$50 and above' },
    ];

    const hasActiveFilters = searchTerm || selectedCategories.length > 0 || priceRange !== 'all' || productType !== 'all';

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, position: 'sticky', top: 90 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Filters
                </Typography>
                {hasActiveFilters && (
                    <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                        sx={{ textTransform: 'none' }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ bgcolor: '#fafafa' }}
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Categories */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Categories
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <FormGroup>
                        {categories.map((category) => (
                            <FormControlLabel
                                key={category.value}
                                control={
                                    <Checkbox
                                        checked={selectedCategories.includes(category.value)}
                                        onChange={() => onCategoryChange(category.value)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography variant="body2">{category.label}</Typography>
                                        <Chip label={category.count} size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                                    </Box>
                                }
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Price Range */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon sx={{ fontSize: 20, color: 'success.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Price Range
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <RadioGroup value={priceRange} onChange={(e) => onPriceRangeChange(e.target.value)}>
                        {priceRanges.map((range) => (
                            <FormControlLabel
                                key={range.value}
                                value={range.value}
                                control={<Radio size="small" />}
                                label={<Typography variant="body2">{range.label}</Typography>}
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Product Type */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalOfferIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Product Type
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <RadioGroup value={productType} onChange={(e) => onProductTypeChange(e.target.value)}>
                        <FormControlLabel
                            value="all"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">All Types</Typography>}
                            sx={{ mb: 0.5 }}
                        />
                        <FormControlLabel
                            value="Digital"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Digital</Typography>}
                            sx={{ mb: 0.5 }}
                        />
                        <FormControlLabel
                            value="Physical"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Physical</Typography>}
                        />
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>

            {/* Results Count */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>{totalProducts}</strong> {totalProducts === 1 ? 'product' : 'products'} found
                </Typography>
            </Box>
        </Paper>
    );
};

export default ProductFilters;
