import { useState, useEffect } from 'react';
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	IconButton,
	Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Logout } from '@mui/icons-material';
import {
	navigationMenuItems,
	bottomMenuItems,
} from '@/app/config/navigationMenu';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import React from 'react';
import Image from 'next/image';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 65;

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState('checking'); // "ok", "partial", "down"
	const [dbStatus, setDbStatus] = useState('checking'); // "ok" or "down"
	const [goServerStatus, setGoServerStatus] = useState('checking'); // "ok" or "down"

	const pathname = usePathname();
	const router = useRouter();

	// Function to check connection status
	const fetchConnectionStatus = async () => {
		try {
			const res = await fetch('/api/system/connection');
			const data = await res.json();

			setDbStatus(data.dbStatus);
			setGoServerStatus(data.goServerStatus);
			setConnectionStatus(data.status);
		} catch (error) {
			console.error('Connection check failed:', error);
			setConnectionStatus('down');
			setDbStatus('down');
			setGoServerStatus('down');
		}
	};

	// Function to handle sign out
	const handleSignOut = async () => {
		await signOut({ callbackUrl: '/' }); // Redirects to login page after signing out
	};

	// Fetch connection status on mount & refresh every 30 seconds
	useEffect(() => {
		fetchConnectionStatus();
		const interval = setInterval(fetchConnectionStatus, 30000);
		return () => clearInterval(interval);
	}, []);

	const handleMenuClick = (item) => {
		if (item.action) return;
		router.push(item.path);
	};

	const renderMenuItem = (item) => {
		const IconComponent = item.icon || null;
		const isSelected = pathname === item.path;

		// Special handling for backend status icon (Cloud)
		if (item.title === 'Backend Status') {
			return (
				<Tooltip
					title={
						connectionStatus === 'ok'
							? 'All Systems Operational'
							: connectionStatus === 'partial'
							? `Partial Outage: ${dbStatus !== 'ok' ? 'DB Down' : ''} ${
									goServerStatus !== 'ok' ? 'Go Server Down' : ''
							  }`
							: 'System Down'
					}
					placement="right"
					arrow
					key={item.id}
				>
					<ListItem
						sx={{
							justifyContent: 'center',
							py: 1.5,
							minHeight: 48,
						}}
					>
						<ListItemIcon
							sx={{
								color:
									connectionStatus === 'ok'
										? 'green' // Everything is up
										: connectionStatus === 'partial'
										? 'orange' // Partial failure
										: 'red', // Everything is down
								minWidth: isCollapsed ? 'auto' : 48,
								justifyContent: 'center',
							}}
						>
							<IconComponent />
						</ListItemIcon>
						{!isCollapsed && <ListItemText primary={item.title} />}
					</ListItem>
				</Tooltip>
			);
		}

		// Render normal menu items
		return (
			<Tooltip
				title={isCollapsed ? item.text || item.title : ''}
				placement="right"
				arrow
			>
				<ListItem
					button
					onClick={() => handleMenuClick(item)}
					selected={isSelected}
					sx={{
						justifyContent: 'center',
						py: 1.5,
						minHeight: 48,
						'&.Mui-selected': {
							backgroundColor: 'primary.main',
							opacity: 0.1,
						},
						'&:hover': {
							color: 'primary.main',
							backgroundColor: 'action.hover',
						},
					}}
				>
					<ListItemIcon
						sx={{
							color: 'primary.main',
							minWidth: isCollapsed ? 'auto' : 48,
							justifyContent: 'center',
						}}
					>
						{IconComponent && <IconComponent />}
					</ListItemIcon>
					{!isCollapsed && <ListItemText primary={item.text || item.title} />}
				</ListItem>
			</Tooltip>
		);
	};

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
					boxSizing: 'border-box',
					backgroundColor: 'background.sidebar',
					borderRight: '1px solid',
					borderColor: 'divider',
					transition: 'width 0.2s ease-in-out',
					overflowX: 'hidden',
				},
			}}
		>
			{/* Logo and Collapse Button */}
			<Box
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<Image
					src="/assets/logos/stratus_logo_3.png"
					alt="Stratus Logo"
					width={isCollapsed ? 85 : 100}
					height={isCollapsed ? 85 : 100}
					style={{ transition: 'all 0.2s ease-in-out', marginRight: '10px' }}
				/>
				<Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '12px' }}>
					Menu
				</Typography>
				<Divider sx={{ width: '100%', bgcolor: 'divider' }} />
				<IconButton
					onClick={() => setIsCollapsed(!isCollapsed)}
					sx={{ color: 'text.secondary' }}
				>
					{isCollapsed ? <ChevronRight /> : <ChevronLeft />}
				</IconButton>
			</Box>

			{/* Navigation Items */}
			<List sx={{ px: 1 }}>
				{navigationMenuItems.map((item) => (
					<React.Fragment key={item.id}>{renderMenuItem(item)}</React.Fragment>
				))}
			</List>

			<Box sx={{ flexGrow: 1 }} />

			{/* Bottom Section */}
			<Box sx={{ p: 1 }}>
				<Divider sx={{ mb: 1 }} />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 1,
					}}
				>
					{bottomMenuItems.map((item) => (
						<React.Fragment key={item.id}>
							{renderMenuItem(item)}
						</React.Fragment>
					))}
					<IconButton
						onClick={handleSignOut}
						sx={{
							color: 'error.main',
							width: '100%',
							justifyContent: isCollapsed ? 'center' : 'flex-start',
							px: 2,
						}}
					>
						<Logout />
						{!isCollapsed && <Typography sx={{ ml: 2 }}>Sign Out</Typography>}
					</IconButton>
				</Box>
			</Box>
		</Drawer>
	);
};

export default Sidebar;
