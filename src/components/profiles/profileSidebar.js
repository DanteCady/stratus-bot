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
import { Edit, ContentCopy, Delete } from '@mui/icons-material';
import useProfileStore from '@/store/profileStore';
import SidebarContextMenu from '@/components/global/sidebarContextMenu';
import { useSnackbar } from '@/context/snackbar';

export default function ProfileSidebar() {
	const {
		profileGroups,
		selectedProfileGroup,
		setSelectedProfileGroup,
		addProfileGroup,
		fetchProfileGroups,
		deleteProfileGroup,
		renameProfileGroup,
		duplicateProfileGroup,
	} = useProfileStore();

	const { showSnackbar } = useSnackbar();

	// Modal State
	const [modalOpen, setModalOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [newGroupName, setNewGroupName] = useState('');
	const [selectedGroup, setSelectedGroup] = useState(null);

	// Context Menu State
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [menuOptions, setMenuOptions] = useState([]);

	// Load Profile Groups on Mount
	useEffect(() => {
		fetchProfileGroups();
	}, []);

	// Open Context Menu
	const handleOpenMenu = (event, group) => {
		setSelectedGroup(group);
		setMenuAnchor(event.currentTarget);

		// Set up menu options dynamically
		setMenuOptions([
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
				await renameProfileGroup(selectedGroup.id, newGroupName);
				showSnackbar('✅ Profile group renamed successfully', 'success');
				setModalOpen(false);
			} catch (error) {
				showSnackbar('❌ Error renaming profile group', 'error');
				console.error('Error renaming profile group:', error);
			}
		} else {
			try {
				await addProfileGroup(newGroupName.trim());
				showSnackbar('✅ Profile group created successfully', 'success');
				setModalOpen(false);
			} catch (error) {
				showSnackbar('❌ Error creating profile group', 'error');
				console.error('Error creating profile group:', error);
			}
		}
	};

	const handleDuplicateGroup = async () => {
		if (selectedGroup) {
			try {
				await duplicateProfileGroup(selectedGroup.id);
				showSnackbar('✅ Profile group duplicated successfully', 'success');
			} catch (error) {
				showSnackbar('❌ Error duplicating profile group', 'error');
				console.error('Error duplicating profile group:', error);
			}
		}
	};

	const handleDeleteGroup = async (group) => {
		if (group.name === 'Default') return;

		try {
			await deleteProfileGroup(group.id);
			showSnackbar('✅ Profile group deleted successfully', 'success');
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error deleting profile group', 'error');
			console.error('Error deleting profile group:', error);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Profile Groups</Typography>

			{/* Create New Profile Group */}
			<Button
				variant="contained"
				color="primary"
				onClick={handleOpenCreateModal}
				sx={{ mt: 2, mb: 2 }}
			>
				+ New Group
			</Button>

			{/* Profile Groups List (Ensuring Default is Always First) */}
			<List>
				{profileGroups
					.slice()
					.sort((a, b) =>
						a.name === 'Default' ? -1 : b.name === 'Default' ? 1 : 0
					) // Default group always first
					.map((group) => (
						<ListItem
							key={group.id}
							button
							selected={selectedProfileGroup?.id === group.id}
							onClick={() => setSelectedProfileGroup(group)}
							sx={{
								backgroundColor:
									selectedProfileGroup?.id === group.id
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

			{/* Rename/Create Profile Group Modal */}
			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>
					{isRenaming ? 'Rename Profile Group' : 'Create New Profile Group'}
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
