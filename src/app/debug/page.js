'use client';
import { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import useAppStore from '@/store/appStore';
import { useSession } from 'next-auth/react';

export default function DebugPage() {
	const { data: session, status } = useSession();
	const { initialized, system, userData, initialize } = useAppStore();

	useEffect(() => {
		const initializeStore = async () => {
			if (status === 'authenticated' && session?.initialData) {
				console.log('🔍 Debug: Full session data:', session);
				console.log('🔍 Debug: Initial data structure:', session.initialData);

				if (!initialized) {
					console.log('🔄 Initializing store with data:', {
						system: session.initialData.system,
						user: session.initialData.user,
					});

					initialize(session.initialData);
				}
			}
		};

		initializeStore();
	}, [status, session, initialized, initialize]);

	// Log whenever store state changes
	useEffect(() => {
		console.log('🔄 Store state updated:', {
			initialized,
			system,
			userData,
		});
	}, [initialized, system, userData]);

	return (
		<Box
			sx={{
				height: '100%',
				overflow: 'auto',
				'&::-webkit-scrollbar': {
					width: '8px',
				},
				'&::-webkit-scrollbar-track': {
					background: 'transparent',
				},
				'&::-webkit-scrollbar-thumb': {
					background: '#888',
					borderRadius: '4px',
				},
				'&::-webkit-scrollbar-thumb:hover': {
					background: '#555',
				},
			}}
		>
			<Paper sx={{ p: 4, m: 2 }}>
				<Typography variant="h4" gutterBottom>
					Debug State Viewer
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Session Status
						</Typography>
						<pre
							style={{
								background: 'rgba(0,0,0,0.8)',
								color: 'white',
								padding: '1rem',
								borderRadius: '8px',
								margin: 0,
							}}
						>
							{JSON.stringify(
								{
									sessionExists: !!session,
									userId: session?.user?.id,
									email: session?.user?.email,
								},
								null,
								2
							)}
						</pre>
					</Paper>

					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Initialization Status
						</Typography>
						<pre
							style={{
								background: 'rgba(0,0,0,0.8)',
								color: 'white',
								padding: '1rem',
								borderRadius: '8px',
								margin: 0,
							}}
						>
							{JSON.stringify({ initialized }, null, 2)}
						</pre>
					</Paper>

					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							System Configuration
						</Typography>
						<pre
							style={{
								background: 'rgba(0,0,0,0.8)',
								color: 'white',
								padding: '1rem',
								borderRadius: '8px',
								margin: 0,
							}}
						>
							{JSON.stringify(
								{
									shopCount: system.shops?.length || 0,
									siteCount: system.sites?.length || 0,
									regionCount: system.regions?.length || 0,
									modeCount: system.modes?.length || 0,
								},
								null,
								2
							)}
						</pre>
					</Paper>

					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							User Data
						</Typography>
						<pre
							style={{
								background: 'rgba(0,0,0,0.8)',
								color: 'white',
								padding: '1rem',
								borderRadius: '8px',
								margin: 0,
							}}
						>
							{JSON.stringify(
								{
									taskGroups: userData.taskGroups?.length || 0,
									profileGroups: userData.profileGroups?.length || 0,
									proxyGroups: userData.proxyGroups?.length || 0,
									tasks: userData.tasks?.length || 0,
									profiles: userData.profiles?.length || 0,
									proxies: userData.proxies?.length || 0,
								},
								null,
								2
							)}
						</pre>
					</Paper>

					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Raw State Data
						</Typography>
						<pre
							style={{
								background: 'rgba(0,0,0,0.8)',
								color: 'white',
								padding: '1rem',
								borderRadius: '8px',
								margin: 0,
								maxHeight: '400px',
								overflow: 'auto',
								'&::-webkit-scrollbar': {
									width: '8px',
								},
								'&::-webkit-scrollbar-track': {
									background: 'transparent',
								},
								'&::-webkit-scrollbar-thumb': {
									background: '#888',
									borderRadius: '4px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: '#555',
								},
							}}
						>
							{JSON.stringify({ system, userData }, null, 2)}
						</pre>
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
}
