import { useState } from 'react';
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
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
	navigationMenuItems,
	bottomMenuItems,
} from '@/app/config/navigationMenu';
import { useRouter, usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 65;

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const handleMenuClick = (item) => {
		if (item.action && item.onClick) {
			item.onClick(logout, authType);
		} else {
			router.push(item.path);
		}
	};

	const renderMenuItem = (item) => {
		const IconComponent = item.icon || null;
		const currentPathSegments = pathname.split('/').filter(Boolean);
		const itemPathSegments = item.path.split('/').filter(Boolean);

		const isSelected =
			!item.action &&
			(pathname === item.path ||
				(currentPathSegments[0] === itemPathSegments[0] &&
					currentPathSegments[1] === itemPathSegments[1]));

		return (
			<Tooltip
				title={isCollapsed ? item.text || item.title : ''}
				placement="right"
				arrow
			>
				<ListItem
					button
					key={item.text || item.title}
					onClick={() => handleMenuClick(item)}
					selected={isSelected}
					sx={{
						'&.Mui-selected': {
							backgroundColor: 'primary.main',
							opacity: 0.1,
							'&:hover': {
								backgroundColor: 'primary.main',
								// opacity: 0.15,
							},
						},
						'&:hover': {
							// backgroundColor: 'primary.main',
							// opacity: 0.05,
							color: 'primary.main',
						},
						justifyContent: isCollapsed ? 'center' : 'flex-start',
						py: 1.5,
					}}
				>
					<ListItemIcon
						sx={{
							color: 'primary.main',
							minWidth: isCollapsed ? 'auto' : 48,
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
					<IconButton
						onClick={() => setIsCollapsed(!isCollapsed)}
						sx={{ color: 'text.secondary' }}
					>
						{isCollapsed ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Tooltip>
			</Box>
			<List>{navigationMenuItems.map(renderMenuItem)}</List>
			<Box sx={{ flexGrow: 1 }} />
			<Divider />
			<List>{bottomMenuItems.map(renderMenuItem)}</List>
		</Drawer>
	);
};

export default Sidebar;
