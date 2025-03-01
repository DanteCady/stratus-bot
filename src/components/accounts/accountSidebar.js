'use client';
import { useState } from 'react';
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
import { Edit, Delete, ContentCopy } from '@mui/icons-material';
import useAccountStore from '@/store/accountStore';
import { useSnackbar } from '@/context/snackbar';
import SidebarContextMenu from '@/components/global/sidebarContextMenu';

export default function AccountSidebar() {
	const {
		accountGroups,
		selectedGroup,
		selectAccountGroup,
		addAccountGroup,
		deleteAccountGroup,
		updateAccountGroup,
		duplicateAccountGroup,
	} = useAccountStore();
	const { showSnackbar } = useSnackbar();

	// Modal State
	const [modalOpen, setModalOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [groupName, setGroupName] = useState('');
	const [selectedGroupForMenu, setSelectedGroupForMenu] = useState(null);

	// Context Menu State
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [menuOptions, setMenuOptions] = useState([]);

	const handleOpenMenu = (event, group) => {
		event.stopPropagation();
		setSelectedGroupForMenu(group);
		setMenuAnchor(event.currentTarget);

		setMenuOptions([
			{
				label: 'Rename',
				icon: <Edit fontSize="small" />,
				action: () => {
					setGroupName(group.name);
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
				disabled: group.is_default,
				style: { color: group.is_default ? 'gray' : 'error.main' },
			},
		]);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	const handleOpenCreateModal = () => {
		setGroupName('');
		setIsRenaming(false);
		setModalOpen(true);
	};

	const handleSaveGroup = async () => {
		if (!groupName.trim()) {
			showSnackbar('Group name is required', 'error');
			return;
		}

		try {
			if (isRenaming && selectedGroupForMenu) {
				await updateAccountGroup(selectedGroupForMenu.account_group_id, groupName);
				showSnackbar('✅ Account group renamed successfully', 'success');
			} else {
				await addAccountGroup(groupName.trim());
				showSnackbar('✅ Account group created successfully', 'success');
			}
			setModalOpen(false);
		} catch (error) {
			showSnackbar('❌ Error saving account group', 'error');
			console.error('Error saving account group:', error);
		}
	};

	const handleDeleteGroup = async (group) => {
		if (group.is_default) {
			showSnackbar('Cannot delete default group', 'error');
			return;
		}

		try {
			await deleteAccountGroup(group.account_group_id);
			showSnackbar('✅ Account group deleted successfully', 'success');
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error deleting account group', 'error');
			console.error('Error deleting account group:', error);
		}
	};

	const handleDuplicateGroup = async (group) => {
		try {
			await duplicateAccountGroup(group.account_group_id);
			showSnackbar('✅ Account group duplicated successfully', 'success');
			setMenuAnchor(null);
		} catch (error) {
			showSnackbar('❌ Error duplicating account group', 'error');
			console.error('Error duplicating account group:', error);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Account Groups</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={handleOpenCreateModal}
				sx={{ mt: 2, mb: 2 }}
			>
				+ New Group
			</Button>

			<List>
				{accountGroups
					.slice()
					.sort((a, b) => (a.is_default ? -1 : b.is_default ? 1 : 0))
					.map((group) => (
						<ListItem
							key={group.account_group_id} 
							button
							selected={selectedGroup?.account_group_id === group.account_group_id}
							onClick={() => selectAccountGroup(group)} 
							sx={{
								backgroundColor:
									selectedGroup?.account_group_id === group.account_group_id
										? 'primary.light'
										: 'transparent',
								'&:hover': { backgroundColor: 'primary.dark' },
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ListItemText primary={group.name} />
							<IconButton
								size="small"
								onClick={(e) => handleOpenMenu(e, group)}
							>
								<MoreVertIcon />
							</IconButton>
						</ListItem>
					))}
			</List>

			<SidebarContextMenu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleCloseMenu}
				menuItems={menuOptions}
			/>

			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>
					{isRenaming ? 'Rename Account Group' : 'Create New Account Group'}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Group Name"
						type="text"
						fullWidth
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
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
