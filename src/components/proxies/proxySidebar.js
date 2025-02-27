'use client';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useProxyStore from '@/store/proxyStore';
import { useSnackbar } from '@/context/snackbar';
import { useState, useEffect } from 'react';

export default function ProxySidebar() {
	const {
		proxyGroups,
		selectedProxyGroup,
		fetchProxyGroups,
		addProxyGroup,
		updateProxyGroup,
		deleteProxyGroup,
		selectProxyGroup,
	} = useProxyStore();
	const { showSnackbar } = useSnackbar();

	const [modalOpen, setModalOpen] = useState(false);
	const [editingGroup, setEditingGroup] = useState(null);
	const [groupName, setGroupName] = useState('');

	// Fetch proxy groups on component mount
	useEffect(() => {
		fetchProxyGroups();
	}, [fetchProxyGroups]);

	const handleOpenModal = (group = null) => {
		setEditingGroup(group);
		setGroupName(group ? group.name : '');
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setEditingGroup(null);
		setGroupName('');
	};

	const handleSaveGroup = async () => {
		try {
			if (!groupName.trim()) {
				showSnackbar('Group name is required', 'error');
				return;
			}

			if (editingGroup) {
				await updateProxyGroup(editingGroup.id, groupName);
				showSnackbar('✅ Group updated successfully', 'success');
			} else {
				await addProxyGroup(groupName);
				showSnackbar('✅ Group created successfully', 'success');
			}
			handleCloseModal();
		} catch (error) {
			showSnackbar('❌ Error saving group', 'error');
			console.error('Error saving proxy group:', error);
		}
	};

	const handleDelete = async (groupId) => {
		try {
			if (proxyGroups.find((group) => group.id === groupId)?.is_default) {
				showSnackbar('Cannot delete default group', 'error');
				return;
			}
			await deleteProxyGroup(groupId);
			showSnackbar('✅ Group deleted successfully', 'success');
		} catch (error) {
			showSnackbar('❌ Error deleting group', 'error');
			console.error('Error deleting proxy group:', error);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Proxy Groups</Typography>

			<Button
				variant="contained"
				color="primary"
				onClick={() => handleOpenModal()}
				sx={{ mt: 2, mb: 2 }}
			>
				+ New Group
			</Button>

			<List>
				{proxyGroups.map((group) => (
					<ListItem
						key={group.id}
						button
						selected={selectedProxyGroup?.id === group.id}
						onClick={() => selectProxyGroup(group)}
						sx={{
							backgroundColor:
								selectedProxyGroup?.id === group.id
									? 'primary.light'
									: 'transparent',
							'&:hover': { backgroundColor: 'primary.dark' },
						}}
					>
						<ListItemText primary={group.name} />
						{!group.is_default && (
							<ListItemSecondaryAction>
								<IconButton
									edge="end"
									onClick={(e) => {
										e.stopPropagation();
										handleOpenModal(group);
									}}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									edge="end"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(group.id);
									}}
								>
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						)}
					</ListItem>
				))}
			</List>

			<Dialog open={modalOpen} onClose={handleCloseModal}>
				<DialogTitle>
					{editingGroup ? 'Edit Proxy Group' : 'Create New Proxy Group'}
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
					<Button onClick={handleCloseModal} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSaveGroup} color="primary" variant="contained">
						{editingGroup ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
