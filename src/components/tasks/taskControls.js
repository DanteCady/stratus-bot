'use client';
import { Box, useTheme } from '@mui/material';
import ControlButton from '@/components/tasks/controlButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';

export default function TaskControls() {
	const theme = useTheme();
	const stopButtonColor = theme.palette.mode === 'light' ? 'red' : 'secondary';

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'flex-end',
				gap: 2,
				width: '100%',
			}}
		>
			<ControlButton
				icon={<PlayArrowIcon />}
				text="Start All Tasks"
				color="primary"
			/>
			<ControlButton
				icon={<StopIcon />}
				text="Stop All Tasks"
				color={stopButtonColor}
			/>
			<ControlButton icon={<EditIcon />} text="Edit All Tasks" color="accent" />
			<ControlButton
				icon={<DeleteIcon />}
				text="Delete All Tasks"
				color="error"
			/>
			<ControlButton icon={<BoltIcon />} text="AI Feature" color="warning" />
		</Box>
	);
}
