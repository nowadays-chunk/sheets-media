
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Container,
    Badge
} from '@mui/material';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Added for cart icon
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'; // Added for homepage-style icon
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

// Styled components to match _app.js and index.js styles
const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const NavLinks = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
});



const MainAppBar = ({ open, handleDrawerToggle, isHomepage = false }) => {
    // If we are on the homepage, we might want a slightly different layout (Container vs Fluid), 
    // but the user asked to "Use one common AppBar elements".
    // The homepage currently uses a Container inside the AppBar. The App uses a fluid width.
    // I will use a responsive logic or just stick to one valid layout. 
    // Let's try to make it work for both. If isHomepage, use Container, else fluid?
    // Actually, consistency is key. Let's make sure the content is the same.

    // Calculate cart count
    const cartItems = useSelector(state => state.cart?.items || []);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const NavigationButtons = () => (
        <>
            <Button component={Link} href="/play" color="inherit">Play</Button>
            <Button component={Link} href="/compose" color="inherit">Compose</Button>
            <Button component={Link} href="/learn" color="inherit">Learn</Button>
            <Button component={Link} href="/news" color="inherit">News</Button>
            <Button component={Link} href="/stats" color="inherit">Stats</Button>
            <Button component={Link} href="/references" color="inherit">References</Button>
            {/* Store in Red Font */}
            <Button component={Link} href="/#store" sx={{ color: 'red', fontWeight: 'bold' }}>Store</Button>

            <IconButton component={Link} href="/cart" color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            {/* Join Competition Outlined in Blue */}
            <Button component={Link} href="/competition" variant="outlined" sx={{ mr: 4, color: '#2196f3', borderColor: '#2196f3', '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(33, 150, 243, 0.04)' } }}>
                Join Competition
            </Button>
        </>
    );

    // Common Toolbar content
    const ToolbarContent = (
        <Toolbar disableGutters={isHomepage} sx={{ justifyContent: 'space-between', width: '100%', px: isHomepage ? 0 : 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Menu Icon for Drawer (App mode) */}
                {!isHomepage && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            ...(open && { display: 'none' }),
                            "@media (min-width:1200px)": { display: "none" }, // Hide on large screens where drawer might be permanent or handled otherwise
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo / Title */}
                <Button component={Link} href="/" color="inherit" startIcon={isHomepage ? <LibraryMusicIcon sx={{ color: 'primary.main' }} /> : <FavoriteIcon color="secondary" />}>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'text.primary', ml: 1, textTransform: 'none' }}>
                        GUITAR SHEETS
                    </Typography>
                </Button>
            </Box>

            {/* Desktop Nav Links */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
                <NavigationButtons />
            </Box>

            {/* Mobile Cart Icon (Visible only on mobile) */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center' }}>
                <IconButton component={Link} href="/cart" color="inherit">
                    <Badge badgeContent={cartCount} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </Box>
        </Toolbar>
    );

    if (isHomepage) {
        return (
            <AppBar position="sticky" color="default" sx={{ bgcolor: 'white', borderBottom: '1px solid #f0f0f0' }} elevation={0}>
                <Container maxWidth="xl">
                    {ToolbarContent}
                </Container>
            </AppBar>
        );
    }

    return (
        <AppBarStyled position="fixed" open={open} color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', color: 'black' }}>
            {ToolbarContent}
        </AppBarStyled>
    );
};

export default MainAppBar;
