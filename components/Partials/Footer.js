import React from 'react';
import { Box, Container, Grid, Typography, Stack, Button } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
    return (
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
                            <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/play" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Player</Typography></Box>
                            <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/compose" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Composer</Typography></Box>
                            <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/store" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Store</Typography></Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">Community</Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            <Box component="li" sx={{ mb: 1 }}><Typography component={Link} href="/competition" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Competitions</Typography></Box>
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
    );
};

export default Footer;
