'use client';
import { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TaskSidebar from '@/components/tasks/taskSidebar';
import TaskControls from '@/components/tasks/taskControls';
import TaskFilters from '@/components/tasks/taskFilters';
import TaskList from '@/components/tasks/taskList';

export default function Tasks() {
	// Default group is non-deletable
	const [taskGroups, setTaskGroups] = useState([{ id: 1, name: 'Default Group', isDefault: true }]);
	const [selectedGroup, setSelectedGroup] = useState(taskGroups[0]);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Task Sidebar */}
			<TaskSidebar
				taskGroups={taskGroups}
				setTaskGroups={setTaskGroups}
				selectedGroup={selectedGroup}
				setSelectedGroup={setSelectedGroup}
			/>

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Typography variant="h4" sx={{ mb: 2 }}>
					{selectedGroup.name}
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TaskControls />
					</Grid>
					<Grid item xs={12}>
						<TaskFilters />
					</Grid>
					<Grid item xs={12}>
						<TaskList />
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
