'use client';
import { useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import useAppStore from '@/store/appStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 

export default function DebugPage() {
	const { data: session, status } = useSession();
	const { initialized, system, userData, initialize } = useAppStore();
	const router = useRouter();

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


	const handleGoBack = () => {
		router.push('/dashboard');
	};

	/** Function to download debug data as a JSON file */
	const handleDownloadReport = () => {
		const debugData = {
			timestamp: new Date().toISOString(),
			session: {
				sessionExists: !!session,
				userId: session?.user?.id,
				email: session?.user?.email,
			},
			initialized,
			system: {
				shopCount: system.shops?.length || 0,
				siteCount: system.sites?.length || 0,
				regionCount: system.regions?.length || 0,
				modeCount: system.modes?.length || 0,
			},
			userData: {
				taskGroups: userData.taskGroups?.length || 0,
				profileGroups: userData.profileGroups?.length || 0,
				proxyGroups: userData.proxyGroups?.length || 0,
				tasks: userData.tasks?.length || 0,
				profiles: userData.profiles?.length || 0,
				proxies: userData.proxies?.length || 0,
			},
			environment: {
				appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
				currentRoute: window.location.pathname,
				userAgent: navigator.userAgent,
			},
			rawState: { system, userData },
		};

		const blob = new Blob([JSON.stringify(debugData, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `debug-report-${new Date().toISOString()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

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
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="h4" gutterBottom>
						Debug State Viewer
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button variant="outlined" color="secondary" onClick={handleGoBack}>
							Back to Dashboard
						</Button>
						<Button variant="contained" color="primary" onClick={handleDownloadReport}>
							Download Report
						</Button>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{/* Session Status */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Session Status
						</Typography>
						<pre style={debugBoxStyle}>{JSON.stringify(
							{
								sessionExists: !!session,
								userId: session?.user?.id,
								email: session?.user?.email,
							},
							null,
							2
						)}</pre>
					</Paper>

					{/* Initialization Status */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Initialization Status
						</Typography>
						<pre style={debugBoxStyle}>{JSON.stringify({ initialized }, null, 2)}</pre>
					</Paper>

					{/* System Configuration */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							System Configuration
						</Typography>
						<pre style={debugBoxStyle}>{JSON.stringify(
							{
								shopCount: system.shops?.length || 0,
								siteCount: system.sites?.length || 0,
								regionCount: system.regions?.length || 0,
								modeCount: system.modes?.length || 0,
							},
							null,
							2
						)}</pre>
					</Paper>

					{/* User Data */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							User Data
						</Typography>
						<pre style={debugBoxStyle}>{JSON.stringify(
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
						)}</pre>
					</Paper>

					{/* Raw State Data */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Raw State Data
						</Typography>
						<pre style={debugBoxStyle}>{JSON.stringify({ system, userData }, null, 2)}</pre>
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
}

const debugBoxStyle = {
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
};
