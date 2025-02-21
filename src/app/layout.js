'use client';
import { ThemeProvider, CssBaseline, Box, IconButton, Typography, AppBar, Toolbar } from '@mui/material';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { lightTheme, darkTheme } from '@/theme';
import Sidebar from '@/components/global/sidebar';
import { DarkMode, LightMode } from '@mui/icons-material';
import { navigationMenuItems } from '@/app/config/navigationMenu';

export default function RootLayout({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	// Get the current page name from pathname
	const pathname = usePathname();
	const pageName = pathname.split('/').pop().toUpperCase();

	// Find the corresponding icon
	const currentPage = navigationMenuItems.find(item => item.path === pathname);
	const PageIcon = currentPage ? currentPage.icon : null;

	return (
		<html lang="en">
			<body>
				<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
					<CssBaseline />
					<Box sx={{ display: 'flex', height: '100vh' }}>
						{/* Sidebar */}
						<Sidebar />

						{/* Main Content Area */}
						<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
							
							{/* Header / Page Title Section */}
							<AppBar
								position="static"
								color="transparent"
								sx={{
									padding: '10px 20px',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									mb: 2,
									boxShadow: 0,
								}}
							>
								<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
									{/* Page Icon and Name */}
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
											{pageName}
										</Typography>
										{PageIcon && (
											<PageIcon sx={{ fontSize: 28, color: 'primary.main' }} />
										)}
									</Box>

									{/* Theme Toggle Button */}
									<IconButton onClick={toggleTheme} sx={{ color: 'primary.main' }}>
										{isDarkMode ? <LightMode /> : <DarkMode />}
									</IconButton>
								</Toolbar>
							</AppBar>

							{/* Main Content Box */}
							<Box sx={{
								flexGrow: 1,
								bgcolor: 'background.default',
								borderRadius: 2,
								p: 3,
								boxShadow: 2
							}}>
								{children}
							</Box>

						</Box>
					</Box>
				</ThemeProvider>
			</body>
		</html>
	);
}
