'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Box, Button, Typography, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CloudIcon from '@mui/icons-material/Cloud';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        signIn('github', { callbackUrl: '/dashboard' });
    };

    return (
        <Container
            maxWidth="sm"
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <CloudIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </motion.div>
            
            <Typography variant="h4" fontWeight="bold" mt={2} gutterBottom>
                Welcome to Stratus
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                The Future of Cloud-Based Botting
            </Typography>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ px: 4, py: 1.5, borderRadius: 3 }}
                    startIcon={!loading && <CloudIcon />}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in with GitHub'}
                </Button>
            </motion.div>
        </Container>
    );
}
