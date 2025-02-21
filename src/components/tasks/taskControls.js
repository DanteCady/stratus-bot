'use client';
import { Box, useTheme, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ControlButton from '@/components/tasks/controlButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';
import AddIcon from '@mui/icons-material/Add';
import useTaskStore from '@/store/taskStore';

export default function TaskControls({ openModal }) {
	const theme = useTheme();
	const stopButtonColor = theme.palette.mode === 'light' ? 'red' : 'secondary';

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				border: `1px solid ${theme.palette.primary.main}`,
				padding: '10px',
				gap: 2,
			}}
		>
			{/* Search Bar */}
			<TextField 
				label="Search Tasks" 
				variant="outlined" 
				fullWidth 
				sx={{ flexGrow: 1 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon color="action" />
						</InputAdornment>
					),
				}}
			/>

			{/* Actions */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				<ControlButton icon={<AddIcon />} text="New Task" color="success"
            onClick={() => {
                openModal();
            }}/>
				<ControlButton icon={<PlayArrowIcon />} text="Start All" color="primary" />
				<ControlButton icon={<StopIcon />} text="Stop All" color={stopButtonColor} />
				<ControlButton icon={<EditIcon />} text="Edit All" color="accent" />
				<ControlButton icon={<DeleteIcon />} text="Delete All" color="error" />
				<ControlButton icon={<BoltIcon />} text="AI Feature" color="warning" />
			</Box>
		</Box>
	);
}
