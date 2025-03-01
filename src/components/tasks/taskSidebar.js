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
		fetchTasks,
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

	// Fetch Task Groups on Mount
	useEffect(() => {
		fetchTaskGroups();
	}, []);

	// Handle Select Group
	const handleSelectGroup = (group) => {
		setSelectedTaskGroup(group);
		fetchTasks(group.task_group_id);
	};

	// Handle Opening Context Menu
	const handleOpenMenu = (event, group) => {
		setSelectedGroup(group);
		setMenuAnchor(event.currentTarget);

		setMenuOptions([
			{
				label: 'Start All',
				icon: <PlayArrow fontSize="small" />,
				action: () => console.log('Starting all tasks in', group.name),
			},
			{
				label: 'Stop All',
				icon: <Stop fontSize="small" />,
				action: () => console.log('Stopping all tasks in', group.name),
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
				disabled: group.is_default, // Prevent deleting default group
				style: { color: group.is_default ? 'gray' : 'error.main' },
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

		try {
			if (isRenaming && selectedGroup) {
				await renameTaskGroup(selectedGroup.task_group_id, newGroupName);
				showSnackbar('✅ Task group renamed successfully', 'success');
			} else {
				await addTaskGroup(newGroupName.trim());
				showSnackbar('✅ Task group created successfully', 'success');
			}
			setModalOpen(false);
		} catch (error) {
			showSnackbar('❌ Error saving task group', 'error');
			console.error('Error:', error);
		}
	};

	const handleDuplicateGroup = async () => {
		try {
			await duplicateTaskGroup(selectedGroup.task_group_id);
			showSnackbar('✅ Task group duplicated successfully', 'success');
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error duplicating task group', 'error');
			console.error('Error duplicating task group:', error);
		}
	};

	const handleDeleteGroup = async (group) => {
		if (group.is_default) return; // Prevent deleting default group

		try {
			await deleteTaskGroup(group.task_group_id);
			showSnackbar('✅ Task group deleted successfully', 'success');
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error deleting task group', 'error');
			console.error('Error deleting task group:', error);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Task Groups</Typography>

			<Button
				variant="contained"
				color="primary"
				onClick={handleOpenCreateModal}
				sx={{ mt: 2, mb: 2 }}
			>
				+ New Group
			</Button>

			<List>
				{taskGroups
					.slice()
					.sort((a, b) => (a.is_default ? -1 : b.is_default ? 1 : 0))
					.map((group) => (
						<ListItem
							key={group.task_group_id}
							button
							selected={selectedTaskGroup?.task_group_id === group.task_group_id}
							onClick={() => handleSelectGroup(group)}
							sx={{
								backgroundColor:
									selectedTaskGroup?.task_group_id === group.task_group_id
										? 'primary.light'
										: 'transparent',
								'&:hover': { backgroundColor: 'primary.dark' },
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ListItemText primary={group.name} />

							<IconButton size="small" onClick={(e) => handleOpenMenu(e, group)}>
								<MoreVertIcon />
							</IconButton>
						</ListItem>
					))}
			</List>

			<SidebarContextMenu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu} menuItems={menuOptions} />

			{/* Create/Rename Task Group Modal */}
			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>{isRenaming ? 'Rename Task Group' : 'Create New Task Group'}</DialogTitle>
				<DialogContent>
					<TextField autoFocus margin="dense" label="Group Name" type="text" fullWidth value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
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
