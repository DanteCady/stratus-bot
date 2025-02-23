'use client';
import { useState, useEffect } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import Image from 'next/image';
import github from '../assets/providers/github.svg';
import discord from '../assets/providers/discord_white.svg';


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
				// Dynamically render login buttons with provider logos from assets
				Object.values(providers).map((provider) => (
					<Button
						key={provider.id}
						variant="contained"
						color="primary"
						onClick={() => signIn(provider.id)}
						sx={{
							mt: 2,
							width: '250px',
							textTransform: 'none',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1.5,
						}}
					>
						<Image
							src={provider.id === 'discord' ? discord : github}
							alt={`${provider.name} logo`}
							width={24}
							height={24}
						/>
						Sign in with {provider.name}
					</Button>
				))
			) : (
				<Typography color="error">No authentication providers available</Typography>
			)}
		</Box>
	);
}
