'use client';
import { useState, useEffect } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import Image from 'next/image';
import github from '../../../assets/providers/github.svg';
import discord from '../../../assets/providers/discord_white.svg';

export default function Login() {
	const [providers, setProviders] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
        getProviders().then((res) => {
            console.log("🔍 Providers fetched:", res);
            setProviders(res);
            setLoading(false); // Ensure loading stops once providers are fetched
        }).catch(err => {
            console.error("❌ Error fetching providers:", err);
            setLoading(false); // Ensure loading stops on error
        });
    }, []);

		const handleSignIn = async (providerId) => {
		console.log('🟢 Attempting sign-in with:', providerId);

		try {
			const result = await signIn(providerId, { redirect: false });

			console.log('🔄 Sign-in result:', result);

			if (result?.ok) {
				console.log(
					'✅ Sign-in successful! Checking for Default Task Group...'
				);

				try {
					// Call API to ensure the Default Task Group exists
					const response = await fetch('/api/task-groups', { method: 'GET' });

					if (!response.ok) {
						throw new Error('Failed to fetch task groups.');
					}

					const { taskGroups } = await response.json();
					console.log('📌 Retrieved Task Groups:', taskGroups);
				} catch (error) {
					console.error('❌ Error ensuring Default Task Group:', error);
				}

				console.log('🚀 Redirecting to dashboard...');
				router.push('/dashboard'); // Redirect after login
			} else {
				console.error('❌ Login failed:', result?.error);
			}
		} catch (error) {
			console.error('❌ Error during sign-in process:', error);
		}
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
			}}
		>
			{/* Background Video */}
			<video
				autoPlay
				loop
				muted
				playsInline
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					width: '100vw',
					height: '100vh',
					transform: 'translate(-50%, -50%)',
					objectFit: 'cover',
					filter: 'brightness(40%) contrast(120%)',
					zIndex: 1,
				}}
			>
				<source src="/assets/auth_video.mp4?v=2" type="video/mp4" />
			</video>

			{/* Centered Content */}
			<Box
				sx={{
					position: 'relative',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					zIndex: 2,
				}}
			>
				<CloudIcon sx={{ fontSize: 64, color: 'primary.main' }} />
				<Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
					Welcome to Stratus
				</Typography>
				<Typography variant="subtitle1" sx={{ color: 'white', opacity: 0.9 }}>
					Next-Gen Botting, Powered by the Cloud
				</Typography>

				{/* Auth Buttons */}
				{loading ? (
					<CircularProgress sx={{ color: 'white' }} />
				) : providers ? (
					Object.values(providers).map((provider) => (
						<Button
							key={provider.id}
							variant="outlined"
							color="primary"
							onClick={() => handleSignIn(provider.id)} // ✅ Use our custom function
							sx={{
								mt: 2,
								width: '250px',
								textTransform: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 1.5,
								boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
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
					<Typography color="error">
						No authentication providers available
					</Typography>
				)}
			</Box>
		</Box>
	);
}
