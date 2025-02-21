'use client';
import { useEffect, useState } from 'react';
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
    TextField
} from '@mui/material';
import useTaskStore from '@/store/taskStore';

export default function TaskSidebar() {
    const { taskGroups, selectedTaskGroup, setSelectedTaskGroup, addTaskGroup, initializeStore } = useTaskStore();

    // Modal State for New Group
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Ensure Store Loads on Mount
    useEffect(() => {
        initializeStore();
    }, []);

    const handleCreateGroup = () => {
        if (newGroupName.trim() !== '') {
            addTaskGroup({ id: Date.now(), name: newGroupName.trim() });
            setNewGroupName('');
            setModalOpen(false);
        }
    };

    return (
        <Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
            <Typography variant="h6">Task Groups</Typography>

            {/* Open Modal for Naming New Group */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2, mb: 2 }}
            >
                + New Group
            </Button>

            {/* Task Groups List */}
            <List>
                {taskGroups.map((group) => (
                    <ListItem
                        key={group.id}
                        button
                        selected={selectedTaskGroup?.id === group.id}
                        onClick={() => setSelectedTaskGroup(group)}
                    >
                        <ListItemText primary={group.name} />
                    </ListItem>
                ))}
            </List>

            {/* New Group Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Create New Task Group</DialogTitle>
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
