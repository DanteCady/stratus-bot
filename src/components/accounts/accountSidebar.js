'use client';
import { Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import useAccountStore from '@/store/accountStore';
import { useState } from 'react';

export default function AccountSidebar() {
	const { accountGroups, selectedGroup, selectAccountGroup, addAccountGroup } = useAccountStore();
	const [modalOpen, setModalOpen] = useState(false);
	const [newGroupName, setNewGroupName] = useState('');

	const handleCreateGroup = () => {
		if (newGroupName.trim() !== '') {
			const newGroup = { id: Date.now(), name: newGroupName.trim() };
			addAccountGroup(newGroup);
			selectAccountGroup(newGroup);
			setNewGroupName('');
			setModalOpen(false);
		}
	};

	return (
		<Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
			<Typography variant="h6">Account Groups</Typography>
			<Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mt: 2, mb: 2 }}>
				+ New Group
			</Button>

			<List>
				{accountGroups.map((group) => (
					<ListItem key={group.id} button selected={selectedGroup?.id === group.id} onClick={() => selectAccountGroup(group)}>
						<ListItemText primary={group.name} />
					</ListItem>
				))}
			</List>

			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>Create New Account Group</DialogTitle>
				<DialogContent>
					<TextField autoFocus fullWidth label="Group Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModalOpen(false)} color="secondary">Cancel</Button>
					<Button onClick={handleCreateGroup} color="primary" variant="contained">Create</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
