'use client';
import { useState } from 'react';
import { Box, useTheme, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ControlButton from '@/components/global/controlButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';
import AddIcon from '@mui/icons-material/Add';
import useTaskStore from '@/store/taskStore';
import ConfirmationModal from '@/components/global/confirmationModal';

export default function TaskControls({ openModal }) {
	const theme = useTheme();
	const stopButtonColor = theme.palette.mode === 'light' ? 'red' : 'secondary';
	const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);
	const tasks = useTaskStore((state) => state.tasks);
	const [confirmOpen, setConfirmOpen] = useState(false);

	// Open confirmation modal for deleting all tasks
	const handleDeleteAll = () => {
		setConfirmOpen(true);
	};

	// Confirm and delete all tasks
	const confirmDeleteAll = () => {
		deleteAllTasks();
		setConfirmOpen(false);
	};

	// Open batch edit modal
	const handleEditAll = () => {
		openModal(); // Opens the modal in batch edit mode
	};

	return (
		<>
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
					<ControlButton icon={<AddIcon />} text="New Task" color="success" onClick={() => openModal()} />
					<ControlButton icon={<PlayArrowIcon />} text="Start All" color="primary" />
					<ControlButton icon={<StopIcon />} text="Stop All" color={stopButtonColor} />
					{/* <ControlButton icon={<EditIcon />} text="Edit All" color="accent" onClick={handleEditAll} /> */}
					<ControlButton icon={<DeleteIcon />} text="Delete All" color="error" onClick={handleDeleteAll} />
					<ControlButton icon={<BoltIcon />} text="AI Feature" color="warning" />
				</Box>
			</Box>

			{/* Delete All Confirmation Modal */}
			<ConfirmationModal
				open={confirmOpen}
				handleClose={() => setConfirmOpen(false)}
				handleConfirm={confirmDeleteAll}
				title="Delete All Tasks"
				message="Are you sure you want to delete all tasks? This action cannot be undone."
			/>
		</>
	);
}
``
