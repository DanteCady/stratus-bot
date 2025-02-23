'use client';
import { useState, useEffect } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';

export default function Login() {
	const [providers, setProviders] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch available providers
		getProviders()
			.then((res) => setProviders(res))
			.finally(() => setLoading(false));
	}, []);

	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 2,
				backgroundColor: 'background.default',
			}}
		>
			<CloudIcon sx={{ fontSize: 64, color: 'primary.main' }} />
			<Typography variant="h4" fontWeight="bold">
				Welcome to Stratus
			</Typography>
			<Typography variant="subtitle1" color="text.secondary">
				The Future of Cloud-Based Botting
			</Typography>

			{/* Show loading spinner while fetching providers */}
			{loading ? (
				<CircularProgress />
			) : providers ? (
				// Dynamically render login buttons
				Object.values(providers).map((provider) => (
					<Button
						key={provider.id}
						variant="contained"
						color="primary"
						startIcon={<CloudIcon />}
						onClick={() => signIn(provider.id)}
						sx={{ mt: 2, width: '250px' }}
					>
						Sign in with {provider.name}
					</Button>
				))
			) : (
				<Typography color="error">No authentication providers available</Typography>
			)}
		</Box>
	);
}
