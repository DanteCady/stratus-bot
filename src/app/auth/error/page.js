'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/snackbar';
import { Box, Button, Typography } from '@mui/material';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const errorMessage = searchParams.get('message') || 'Authentication failed. Please try again.';

    useEffect(() => {
        showSnackbar(errorMessage, 'error');
    }, [errorMessage, showSnackbar]);

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
            }}
        >
            <Typography variant="h5" fontWeight="bold" color="error">
                Authentication Error
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {errorMessage}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/')}
                sx={{ mt: 2 }}
            >
                Return to Login
            </Button>
        </Box>
    );
}
