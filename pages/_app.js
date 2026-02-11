"use client";

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import globalTheme from '../ui/theme';
import { createTheme, ThemeProvider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Open_Sans } from 'next/font/google';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/styles.css';
import '../styles/CircleOfFifths.css';
import './styles.css';
import MainAppBar from '../components/Partials/MainAppBar';
import CartDrawer from '../components/cart/CartDrawer';
import Head from 'next/head';
import Script from 'next/script';

const inter = Open_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

const theme = createTheme({
  typography: {
    fontFamily: ['Chilanka', 'cursive'].join(','),
  },
});

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: '100%',
    maxWidth: '100%',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Container = styled('div')({
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
});

const DrawerContent = styled('div')({
  width: drawerWidth,
  zIndex: 10000,
  position: 'relative',
});

function App({ Component, pageProps }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHomepage = router.pathname === '/';

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDrawerClose = () => setDrawerOpen(false);

  if (isHomepage) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <Component {...pageProps} />
          <CartDrawer />
        </ThemeProvider>
      </Provider>
    );
  }

  const drawer = (
    <DrawerContent>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {globalTheme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        <ListItem component={Link} href="/play" onClick={handleDrawerToggle} button><ListItemText primary="Play and Visualize" /></ListItem>
        <ListItem component={Link} href="/news" onClick={handleDrawerToggle} button><ListItemText primary="Musicians News" /></ListItem>
        <ListItem component={Link} href="/learn" onClick={handleDrawerToggle} button><ListItemText primary="Learn Songs" /></ListItem>
        <ListItem component={Link} href="/circle" onClick={handleDrawerToggle} button><ListItemText primary="The Circle Of Fifths" /></ListItem>
        <ListItem component={Link} href="/compose" onClick={handleDrawerToggle} button><ListItemText primary="Compose Music" /></ListItem>
        <ListItem component={Link} href="/competition" onClick={handleDrawerToggle} button><ListItemText primary="Join Competition" /></ListItem>
        <ListItem component={Link} href="/stats" onClick={handleDrawerToggle} button><ListItemText primary="Stats" /></ListItem>
        <ListItem component={Link} href="/tables" onClick={handleDrawerToggle} button><ListItemText primary="Tables" /></ListItem>
        <ListItem component={Link} href="/references" onClick={handleDrawerToggle} button><ListItemText primary="References" /></ListItem>
        <ListItem component={Link} href="/store" onClick={handleDrawerToggle} button><ListItemText primary="Store" sx={{ color: 'red' }} /></ListItem>
      </List>

      <Divider />
    </DrawerContent>
  );

  return (
    <>
      <Head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </Head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-L813ECJ9RR" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-L813ECJ9RR');
              `,
        }}
      />
      <style jsx global>{`
        html, body {
          overflow-x: hidden !important;
          max-width: 100% !important;
          background-color: #ffffff;
          color: #000000;
        }
        html {
          font-family: ${inter.style.fontFamily};
          font-weight: 300;
        }
      `}</style>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>

          <Box sx={{ display: 'flex', width: '100%', overflowX: 'hidden', bgcolor: 'white', color: 'black' }}>

            <MainAppBar
              open={drawerOpen}
              handleDrawerToggle={handleDrawerToggle}
              isHomepage={false}
            />

            <nav style={{ zIndex: 10000 }}>
              <Drawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    zIndex: 10000,
                    position: 'fixed',
                  },
                  "@media (min-width:1200px)": {
                    display: "none",
                  },
                }}
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
              >
                {drawer}
              </Drawer>
            </nav>

            <Main open={drawerOpen}>
              <Container>
                <Component {...pageProps} leftDrawerOpen={drawerOpen} leftDrawerWidth={drawerWidth} />
              </Container>
            </Main>

            <CartDrawer />

          </Box>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
