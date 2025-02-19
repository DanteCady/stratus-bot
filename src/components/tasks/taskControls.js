'use client';
import { Box, Button } from '@mui/material';

export default function TaskControls() {
	return (
		<Box>
			<Button
				variant="contained"
				color="primary"
				sx={{
					backgroundColor: '#1a73e8',
					color: '#fff',
					boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
					borderRadius: '8px',
					'&:hover': {
						backgroundColor: '#1669c1',
					},
				}}
			>
				Start Tasks
			</Button>
			<Button
				variant="outlined"
				color="secondary"
				sx={{
					ml: 2,
					borderColor: '#ff4081',
					color: '#ff4081',
					borderRadius: '8px',
					'&:hover': {
						borderColor: '#f50057',
						color: '#f50057',
					},
				}}
			>
				Stop Tasks
			</Button>
		</Box>
	);
}
