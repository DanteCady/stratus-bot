'use client';
import { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
	PlayArrow,
	Stop,
	Terminal,
	Edit,
	ContentCopy,
	Delete,
} from '@mui/icons-material';
import useTaskStore from '@/store/taskStore';
import SidebarContextMenu from '@/components/global/sidebarContextMenu';
import { useSnackbar } from '@/context/snackbar'; 

export default function TaskSidebar() {
	const {
		taskGroups,
		selectedTaskGroup,
		setSelectedTaskGroup,
		addTaskGroup,
		fetchTaskGroups,
		deleteTaskGroup,
		renameTaskGroup,
		duplicateTaskGroup,
	} = useTaskStore();

	const { showSnackbar } = useSnackbar();

	// Modal State
	const [modalOpen, setModalOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [newGroupName, setNewGroupName] = useState('');
	const [selectedGroup, setSelectedGroup] = useState(null);

	// Context Menu State
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [menuOptions, setMenuOptions] = useState([]);

	// Load Task Groups on Mount
	useEffect(() => {
		fetchTaskGroups();
	}, []);

	const handleOpenMenu = (event, group) => {
		setSelectedGroup(group);
		setMenuAnchor(event.currentTarget);

		// Set up menu options dynamically
		setMenuOptions([
			{
				label: 'Start All',
				icon: <PlayArrow fontSize="small" />,
				action: () => console.log('Start All', group),
			},
			{
				label: 'Stop All',
				icon: <Stop fontSize="small" />,
				action: () => console.log('Stop All', group),
			},
			'divider',
			{
				label: 'Rename',
				icon: <Edit fontSize="small" />,
				action: () => {
					setNewGroupName(group.name);
					setIsRenaming(true);
					setModalOpen(true);
					setMenuAnchor(null);
				},
			},
			{
				label: 'Duplicate',
				icon: <ContentCopy fontSize="small" />,
				action: () => handleDuplicateGroup(group),
			},
			{
				label: 'Delete',
				icon: <Delete fontSize="small" />,
				action: () => handleDeleteGroup(group),
				disabled: group.name === 'Default',
				style: { color: group.name === 'Default' ? 'gray' : 'error.main' },
			},
		]);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	const handleOpenCreateModal = () => {
		setNewGroupName('');
		setIsRenaming(false);
		setModalOpen(true);
	};

	const handleSaveGroup = async () => {
		if (!newGroupName.trim()) return;

		if (isRenaming && selectedGroup) {
			try {
				await renameTaskGroup(selectedGroup.id, newGroupName);
				showSnackbar('✅ Task group renamed successfully', 'success');
				setModalOpen(false);
			} catch (error) {
				showSnackbar('❌ Error renaming task group', 'error');
				console.error('Error renaming group:', error);
			}
		} else {
			try {
				await addTaskGroup(newGroupName.trim());
				showSnackbar('✅ Task group created successfully', 'success'); 
				setModalOpen(false);
			} catch (error) {
				showSnackbar('❌ Error creating task group', 'error');
				console.error('Error creating group:', error);
			}
		}
	};

	const handleDuplicateGroup = async () => {
		if (selectedGroup) {
			try {
				console.log("🔄 Duplicating group:", selectedGroup.id);
				await duplicateTaskGroup(selectedGroup.id);
				showSnackbar('✅ Task group duplicated successfully', 'success'); 
				console.log("✅ Duplicate process completed!");
			} catch (error) {
				showSnackbar('❌ Error duplicating task group', 'error');
				console.error("❌ Error duplicating group:", error);
			}
		}
	};

	const handleDeleteGroup = async (group) => {
		if (group.name === 'Default') return; // Prevent deleting default group

		try {
			await deleteTaskGroup(group.id);
			showSnackbar('✅ Task group deleted successfully', 'success'); 
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error deleting task group', 'error');
			console.error("❌ Error deleting group:", error);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Task Groups</Typography>

			{/* Open Modal for Creating a New Group */}
			<Button
				variant="contained"
				color="primary"
				onClick={handleOpenCreateModal}
				sx={{ mt: 2, mb: 2 }}
			>
				+ New Group
			</Button>

			{/* Task Groups List (Ensuring Default is Always First) */}
			<List>
				{taskGroups
					.slice() // Clone array to avoid modifying state directly
					.sort((a, b) =>
						a.name === 'Default' ? -1 : b.name === 'Default' ? 1 : 0
					) // Ensure "Default" stays first
					.map((group) => (
						<ListItem
							key={group.id}
							button
							selected={selectedTaskGroup?.id === group.id}
							onClick={() => setSelectedTaskGroup(group)}
							sx={{
								backgroundColor:
									selectedTaskGroup?.id === group.id
										? 'primary.light'
										: 'transparent',
								'&:hover': { backgroundColor: 'primary.dark' },
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ListItemText primary={group.name} />

							{/* More Options Button */}
							<IconButton
								size="small"
								onClick={(e) => handleOpenMenu(e, group)}
							>
								<MoreVertIcon />
							</IconButton>
						</ListItem>
					))}
			</List>

			{/* Global Context Menu */}
			<SidebarContextMenu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleCloseMenu}
				menuItems={menuOptions}
			/>

			{/* Rename/Create Group Modal */}
			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>
					{isRenaming ? 'Rename Task Group' : 'Create New Task Group'}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Group Name"
						type="text"
						fullWidth
						value={newGroupName}
						onChange={(e) => setNewGroupName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModalOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSaveGroup} color="primary" variant="contained">
						{isRenaming ? 'Rename' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
