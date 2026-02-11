import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider,
    LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { toggleCart, removeFromCart, updateQuantity } from '../../redux/actions/cartActions';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const { items, total, isOpen } = useSelector(state => state.cart);
    const [progress, setProgress] = useState(0);

    // Free shipping threshold logic (Professional touch)
    const FREE_SHIPPING_THRESHOLD = 50;

    useEffect(() => {
        const calculatedProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
        setProgress(calculatedProgress);
    }, [total]);

    const handleClose = () => {
        dispatch(toggleCart());
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, p: 0 }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">Your Cart ({items.length})</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>

                {/* Free Shipping Progress */}
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    {total >= FREE_SHIPPING_THRESHOLD ? (
                        <Typography variant="body2" color="success.main" fontWeight="bold" align="center">
                            🎉 You've unlocked FREE Shipping!
                        </Typography>
                    ) : (
                        <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                            Spend <b>${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)}</b> more for Free Shipping
                        </Typography>
                    )}
                    <LinearProgress variant="determinate" value={progress} color={total >= FREE_SHIPPING_THRESHOLD ? "success" : "primary"} sx={{ height: 8, borderRadius: 4, mt: 1 }} />
                </Box>

                <Divider />

                {/* Cart Items */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {items.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 4 }}>
                            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.2 }} />
                            <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                            <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>Continue Shopping</Button>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                src={item.image}
                                                alt={item.title}
                                                sx={{ width: 60, height: 60, mr: 2, bgcolor: '#eee' }}
                                            />
                                        </ListItemAvatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ pr: 2 }}>{item.title}</Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    sx={{ mt: -0.5, mr: -1 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                ${item.price}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                                                    <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, item.quantity - 1))}>
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Typography sx={{ px: 1, fontSize: '0.9rem' }}>{item.quantity}</Typography>
                                                    <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, item.quantity + 1))}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer Analysis */}
                {items.length > 0 && (
                    <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1">Subtotal</Typography>
                            <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                        </Box>
                        <Button
                            component={Link}
                            href="/cart"
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleClose} // Navigate to checkout
                            sx={{ py: 1.5 }}
                        >
                            Checkout Now
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
