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
import { navigationMenuItems, bottomMenuItems } from '@/app/config/navigationMenu';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

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
							? `Partial Outage: ${dbStatus !== 'ok' ? 'DB Down' : ''} ${goServerStatus !== 'ok' ? 'Go Server Down' : ''}`
							: 'System Down'
					}
					placement="right"
					arrow
					key={item.title}
				>
					<ListItem
						sx={{
							cursor: 'default', // Prevents clicking
							justifyContent: isCollapsed ? 'center' : 'flex-start',
							py: 1.5,
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
			<Tooltip title={isCollapsed ? item.text || item.title : ''} placement="right" arrow>
				<ListItem
					button
					key={item.text || item.title}
					onClick={() => handleMenuClick(item)}
					selected={isSelected}
					sx={{
						'&.Mui-selected': { backgroundColor: 'primary.main', opacity: 0.1 },
						'&:hover': { color: 'primary.main' },
						justifyContent: isCollapsed ? 'center' : 'flex-start',
						py: 1.5,
					}}
				>
					<ListItemIcon sx={{ color: 'primary.main', minWidth: isCollapsed ? 'auto' : 48 }}>
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
				},
			}}
		>
			<Box
				sx={{
					p: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: isCollapsed ? 'center' : 'space-between',
				}}
			>
				{!isCollapsed && (
					<Typography variant="h6" sx={{ color: 'primary.main' }}>
						Logo
					</Typography>
				)}
				<Tooltip title={isCollapsed ? 'Expand' : 'Collapse'}>
					<IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: 'text.secondary' }}>
						{isCollapsed ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Tooltip>
			</Box>

			<List>{navigationMenuItems.map(renderMenuItem)}</List>

			<Box sx={{ flexGrow: 1 }} />
			<Divider />

			{/* Bottom Section: Backend Status & Logout */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: isCollapsed ? 'column' : 'row', // Stack vertically if collapsed
					alignItems: 'center',
					justifyContent: isCollapsed ? 'center' : 'space-between',
					p: 1,
				}}
			>
				{/* Backend Status Icon */}
				{bottomMenuItems.map((item) => renderMenuItem(item))}

				{/* Vertical Divider (Hidden when collapsed) */}
				{!isCollapsed && <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '80px', bgcolor: 'gray' }} />}

				{/* Sign Out Button */}
				<Tooltip title="Sign Out">
					<IconButton onClick={() => signOut()} sx={{ color: 'error.main' }}>
						<Logout />
					</IconButton>
				</Tooltip>
			</Box>
		</Drawer>
	);
};

export default Sidebar;
