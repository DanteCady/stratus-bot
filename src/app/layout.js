'use client';
import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, IconButton, Typography, AppBar, Toolbar } from '@mui/material';
import { usePathname } from 'next/navigation';
import { lightTheme, darkTheme } from '@/theme';
import Sidebar from '@/components/global/sidebar';
import { DarkMode, LightMode } from '@mui/icons-material';
import { navigationMenuItems } from '@/app/config/navigationMenu';

export default function RootLayout({ children }) {
	const pathname = usePathname();
	const pageName = pathname.split('/').pop().toUpperCase();
	const currentPage = navigationMenuItems.find(item => item.path === pathname);
	const PageIcon = currentPage ? currentPage.icon : null;

	// Default to `undefined` to prevent hydration mismatch
	const [isDarkMode, setIsDarkMode] = useState(undefined);

	// Set theme mode once the component is mounted (client-side)
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') === 'dark';
		setIsDarkMode(storedTheme);
	}, []);

	// Handle theme toggle
	const toggleTheme = () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		localStorage.setItem('stratus-theme', newTheme ? 'dark' : 'light');
	};

	// Ensure no rendering until `useEffect` sets the theme
	if (isDarkMode === undefined) return null;

	return (
		<html lang="en" style={{ height: '100%', overflow: 'hidden' }}>
			<body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
				<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
					<CssBaseline />
					<Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
						<Sidebar />
						<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
							<AppBar
								position="static"
								color="transparent"
								sx={{
									padding: '10px 20px',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									boxShadow: 0,
								}}
							>
								<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography variant="h6" sx={{ fontWeight: 'bold', color: 'theme.palette.primary.main' }}>
											{pageName}
										</Typography>
										{PageIcon && <PageIcon sx={{ fontSize: 28, color: 'theme.palette.primary.main' }} />}
									</Box>
									<IconButton onClick={toggleTheme} sx={{ color: 'theme.palette.primary.main' }}>
										{isDarkMode ? <LightMode /> : <DarkMode />}
									</IconButton>
								</Toolbar>
							</AppBar>

							<Box
								sx={{
									flexGrow: 1,
									bgcolor: 'background.default',
									borderRadius: 2,
									p: 3,
									boxShadow: 2,
									overflow: 'hidden',
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
								}}
							>
								{children}
							</Box>
						</Box>
					</Box>
				</ThemeProvider>
			</body>
		</html>
	);
}
