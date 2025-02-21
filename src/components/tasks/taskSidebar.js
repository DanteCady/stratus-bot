import { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

export default function TaskSidebar({ selectedGroup, setSelectedGroup }) {
	// Load task groups from local storage or set default
	const [taskGroups, setTaskGroups] = useState(() => {
		if (typeof window !== 'undefined') {
			const savedGroups = localStorage.getItem('taskGroups');
			return savedGroups ? JSON.parse(savedGroups) : [{ id: 1, name: 'Default Group', isDefault: true }];
		}
		return [{ id: 1, name: 'Default Group', isDefault: true }];
	});

	// Load selected group from local storage or default to the first group
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedSelectedGroup = localStorage.getItem('selectedGroup');
			if (savedSelectedGroup) {
				const parsedGroup = JSON.parse(savedSelectedGroup);
				const exists = taskGroups.some(group => group.id === parsedGroup.id);
				if (exists) setSelectedGroup(parsedGroup);
				else setSelectedGroup(taskGroups[0]);
			} else {
				setSelectedGroup(taskGroups[0]);
			}
		}
	}, [taskGroups]);

	// Save task groups to local storage when they change
	useEffect(() => {
		localStorage.setItem('taskGroups', JSON.stringify(taskGroups));
	}, [taskGroups]);

	// Save selected group to local storage when it changes
	useEffect(() => {
		if (selectedGroup) {
			localStorage.setItem('selectedGroup', JSON.stringify(selectedGroup));
		}
	}, [selectedGroup]);

	// Add a new group
	const addTaskGroup = () => {
		const newGroup = { id: Date.now(), name: `New Group`, isDefault: false };
		setTaskGroups(prevGroups => [...prevGroups, newGroup]);
	};

	// Rename a group
	const renameTaskGroup = (id) => {
		const newName = prompt('Rename Group:', taskGroups.find(group => group.id === id)?.name);
		if (newName) {
			setTaskGroups(taskGroups.map(group => (group.id === id ? { ...group, name: newName } : group)));
		}
	};

	// Delete a group (except default)
	const deleteTaskGroup = (id) => {
		const updatedGroups = taskGroups.filter(group => group.id !== id);
		setTaskGroups(updatedGroups);
		
		// If the deleted group was selected, reset to default
		if (selectedGroup.id === id) {
			setSelectedGroup(updatedGroups[0] || { id: 1, name: 'Default Group', isDefault: true });
		}
	};

	return (
		<Box
			sx={{
				width: 240,
				bgcolor: 'background.default',
				borderRight: '1px solid',
				borderColor: 'divider',
				p: 2,
                
			}}
		>
			<Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
				Task Groups
			</Typography>
			<Button variant="contained" fullWidth onClick={addTaskGroup} startIcon={<Add />} sx={{ mb: 2 }}>
				New Group
			</Button>

			{/* List of Task Groups */}
			<List>
				{taskGroups.map(group => (
					<ListItem
						key={group.id}
						button
						selected={selectedGroup?.id === group.id}
						onClick={() => setSelectedGroup(group)}
						sx={{
							'&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' },
							'&:hover': { bgcolor: 'action.hover' },
						}}
					>
						<ListItemText primary={group.name} />
						{/* Rename & Delete Buttons */}
						{!group.isDefault && (
							<>
								<IconButton size="small" onClick={() => renameTaskGroup(group.id)}>
									<Edit fontSize="small" />
								</IconButton>
								<IconButton size="small" onClick={() => deleteTaskGroup(group.id)}>
									<Delete fontSize="small" />
								</IconButton>
							</>
						)}
					</ListItem>
				))}
			</List>
		</Box>
	);
}
