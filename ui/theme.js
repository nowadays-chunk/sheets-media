
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3', // Material Blue
        },
        secondary: {
            main: '#f44336', // Material Red
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000', // Pure Black
            secondary: '#424242', // Dark Grey for hierarchy
        },
        divider: '#eeeeee',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            color: '#000000',
        },
        h2: {
            fontWeight: 700,
            color: '#000000',
        },
        h3: {
            fontWeight: 600,
            color: '#000000',
        },
        h4: {
            fontWeight: 600,
            color: '#000000',
        },
        h5: {
            fontWeight: 600,
            color: '#000000',
        },
        h6: {
            fontWeight: 600,
            color: '#000000',
        },
        body1: {
            color: '#000000', // Ensure body text is black
        },
        subtitle1: {
            color: '#000000',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'rgba(33, 150, 243, 0.08)', // Using primary color tint
                    },
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    }
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    }
                }

            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: 'none', // Removed shadow for "purified" look
                    border: '1px solid #eeeeee', // Use border instead
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: '#2196f3', // Highlight with blue on hover
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: 'none',
                    border: '1px solid #f0f0f0'
                },
                elevation4: {
                    boxShadow: 'none',
                    borderBottom: '1px solid #eeeeee'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    boxShadow: 'none',
                    borderBottom: '1px solid #eeeeee',
                },
            },
        },
    },
});

export default theme;
