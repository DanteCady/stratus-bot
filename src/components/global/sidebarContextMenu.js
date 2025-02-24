'use client';
import { Menu, MenuItem, Divider } from '@mui/material';

export default function SidebarContextMenu({
	anchorEl,
	open,
	onClose,
	menuItems = [],
}) {
	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose}>
			{menuItems.length > 0 ? (
				menuItems.map((item, index) =>
					item === 'divider' ? (
						<Divider key={index} />
					) : (
						<MenuItem
							key={index}
							onClick={() => {
								item.action?.();
								onClose();
							}}
							disabled={item.disabled}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								...item.style,
							}}
						>
							{item.label}
							<span style={{ marginLeft: '10px' }}>{item.icon}</span>
						</MenuItem>
					)
				)
			) : (
				<MenuItem disabled>No actions available</MenuItem>
			)}
		</Menu>
	);
}
