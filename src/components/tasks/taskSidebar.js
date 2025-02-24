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
    TextField
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PlayArrow, Stop, Terminal, Timer, Edit, ContentCopy, Delete } from '@mui/icons-material';
import useTaskStore from '@/store/taskStore';
import SidebarContextMenu from '@/components/global/sidebarContextMenu';

export default function TaskSidebar() {
    const { taskGroups, selectedTaskGroup, setSelectedTaskGroup, addTaskGroup, fetchTaskGroups, deleteTaskGroup, renameTaskGroup } = useTaskStore();

    // Modal State for New Group
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Context Menu State
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuOptions, setMenuOptions] = useState([]);

    // Load Task Groups on Mount
    useEffect(() => {
        fetchTaskGroups();
    }, []);

    const handleCreateGroup = async () => {
        if (newGroupName.trim() !== '') {
            await addTaskGroup(newGroupName.trim()); // Ensure it persists in the DB
            setNewGroupName('');
            setModalOpen(false);
        }
    };

    const handleOpenMenu = (event, group) => {
        setSelectedGroup(group);
        setMenuAnchor(event.currentTarget);

        // Ensure menu updates when a new group is selected
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
            // {
            //     label: 'Schedule Group',
            //     icon: <Timer fontSize="small" />,
            //     action: () => console.log('Schedule', group),
            // },
            'divider',
            {
                label: 'Rename',
                icon: <Edit fontSize="small" />,
                action: () => {
                    setNewGroupName(group.name);
                    setModalOpen(true);
                    setMenuAnchor(null);
                },
            },
            {
                label: 'Duplicate',
                icon: <ContentCopy fontSize="small" />,
                action: () => console.log('Duplicate', group),
            },
            {
                label: 'Delete',
                icon: <Delete fontSize="small" />,
                action: () => {
                    if (group.name !== 'Default') {
                        deleteTaskGroup(group.id);
                        setMenuAnchor(null);
                    }
                },
                disabled: group.name === 'Default',
                style: { color: group.name === 'Default' ? 'gray' : 'error.main' },
            },
        ]);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
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
                        sx={{
                            backgroundColor: selectedTaskGroup?.id === group.id ? 'primary.light' : 'transparent',
                            '&:hover': { backgroundColor: 'primary.dark' },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <ListItemText primary={group.name} />

                        {/* More Options Button */}
                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, group)}>
                            <MoreVertIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {/* Global Context Menu */}
            <SidebarContextMenu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu} menuItems={menuOptions} />

            {/* Rename Group Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Rename Task Group</DialogTitle>
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
                    <Button
                        onClick={async () => {
                            await renameTaskGroup(selectedGroup.id, newGroupName);
                            setModalOpen(false);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
