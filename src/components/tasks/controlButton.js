'use client';
import { Box, Button, Tooltip, useTheme } from '@mui/material';
import { Icon } from '@mui/material';

export default function ControlButton({ icon, text, color }) {
	const theme = useTheme();

	return (
		<Tooltip title={text || ''}>
			<Button
				variant="contained"
				sx={{
					backgroundColor: 'transparent',
					border: `1px solid ${theme.palette[color].main}`,
					color: '#FFFFFF',
					boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
					borderRadius: '50%',
					height: '40px',
					width: '40px',
					minWidth: '40px',
					transition: 'background-color 0.3s ease, color 0.3s ease',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					'&:hover': {
						backgroundColor: theme.palette[color].main,
						'& .MuiSvgIcon-root': {
							color: '#FFFFFF',
						},
					},
				}}
			>
				<Icon
					sx={{
						fontSize: '15px',
						color: theme.palette[color].main,
						marginBottom: '5px',
						padding: 0,
						margin: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{icon}
				</Icon>
			</Button>
		</Tooltip>
	);
}
