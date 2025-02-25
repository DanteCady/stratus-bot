'use client';
import { Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import useProxyStore from '@/store/proxyStore';
import { useEffect, useState } from 'react';

export default function ProxySidebar() {
    const { proxyGroups, selectedGroup, selectProxyGroup, addProxyGroup } = useProxyStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        // Ensure Zustand updates with the correct selected group from localStorage
        const storedGroup = JSON.parse(localStorage.getItem('selectedProxyGroup'));
        if (storedGroup && storedGroup.id !== selectedGroup?.id) {
            selectProxyGroup(storedGroup);
        }
    }, [selectedGroup]);

    const handleCreateGroup = () => {
        if (newGroupName.trim() !== '') {
            const newGroup = { id: Date.now(), name: newGroupName.trim() };
            addProxyGroup(newGroup);
            selectProxyGroup(newGroup); // Auto-select new group
            setNewGroupName('');
            setModalOpen(false);
        }
    };

    return (
        <Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
            <Typography variant="h6">Proxy Groups</Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2, mb: 2 }}
            >
                + New Group
            </Button>

            <List>
                {proxyGroups.map((group) => (
                    <ListItem
                        key={group.id}
                        button
                        selected={selectedGroup?.id === group.id}
                        onClick={() => selectProxyGroup(group)}
                        sx={{ backgroundColor: selectedGroup?.id === group.id ? 'primary.light' : 'transparent' }}
                    >
                        <ListItemText primary={group.name} />
                    </ListItem>
                ))}
            </List>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Create New Proxy Group</DialogTitle>
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
                    <Button onClick={handleCreateGroup} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
