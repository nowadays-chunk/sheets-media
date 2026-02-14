import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Interpretation = ({ text }) => {
    if (!text) return null;
    return (
        <Box sx={{
            mb: 1,
            p: 1.5,
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '8px',
            borderLeft: '4px solid #1976d2',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5
        }}>
            <InfoOutlinedIcon sx={{ color: '#1976d2', fontSize: '1.2rem', mt: 0.3 }} />
            <Box>
                <Typography variant="caption" fontWeight="bold" sx={{ color: '#1976d2', display: 'block', textTransform: 'uppercase', mb: 0.5, letterSpacing: '0.5px' }}>
                    Musical Logic & Mathematics
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.4 }}>
                    {text}
                </Typography>
            </Box>
        </Box>
    );
};

export default Interpretation;
