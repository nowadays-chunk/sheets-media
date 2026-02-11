import React, { useState } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Box,
    IconButton,
    Divider,
    Paper,
    FormControlLabel,
    Checkbox,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeFromCart, updateQuantity, clearCart } from '../redux/actions/cartActions';

const CartPage = () => {
    const { items, total } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate checkout
        setTimeout(() => {
            setSuccess(true);
            dispatch(clearCart());
        }, 1500);
    };

    if (success) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom color="success.main">
                    Thank you for your order!
                </Typography>
                <Typography variant="body1" paragraph>
                    Your order has been placed successfully. You will receive an email confirmation shortly.
                </Typography>
                <Button variant="contained" href="/" sx={{ mt: 2 }}>
                    Return to Home
                </Button>
            </Container>
        );
    }

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Your Cart is Empty
                </Typography>
                <Button variant="contained" href="/#store" sx={{ mt: 2 }}>
                    Go to Store
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Head>
                <title>Shopping Cart - Guitar Sheets</title>
            </Head>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Shopping Cart
            </Typography>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} variant="outlined">
                        {items.map((item) => (
                            <Box key={item.id}>
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                    {/* Image (Hidden on mobile for space) */}
                                    <Box sx={{ width: 80, height: 80, bgcolor: '#f5f5f5', display: { xs: 'none', sm: 'block' }, mr: 2, position: 'relative' }}>
                                        {/* You can allow Image component here if you want visuals, 
                                            but keeping it simple with colored box if image is missing 
                                        */}
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">${item.price}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                                        <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, item.quantity - 1))}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                        <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, item.quantity + 1))}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 60, textAlign: 'right' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>

                                    <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))} sx={{ ml: 1 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <Divider />
                            </Box>
                        ))}
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h5" color="secondary" fontWeight="bold">${total.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Checkout Form */}
                <Grid item xs={12} md={5}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>checkout details</Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth type="email" label="Email Address" name="email" value={formData.email} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth label="Address" name="address" value={formData.address} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="ZIP / Postal" name="zip" value={formData.zip} onChange={handleInputChange} size="small" />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Payment Information</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth label="Name on Card" name="cardName" value={formData.cardName} onChange={handleInputChange} size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth label="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} size="small" placeholder="0000 0000 0000 0000" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="Exp Date" name="expDate" value={formData.expDate} onChange={handleInputChange} size="small" placeholder="MM/YY" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField required fullWidth label="CVV" name="cvv" value={formData.cvv} onChange={handleInputChange} size="small" />
                                    </Grid>
                                </Grid>
                                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }}>
                                    Place Order (${total.toFixed(2)})
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;
