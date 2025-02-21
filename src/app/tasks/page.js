'use client';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TaskControls from '@/components/tasks/taskControls';
import TaskList from '@/components/tasks/taskList';
import DynamicModal from '@/components/global/dynamicModal';
import useTaskStore from '@/store/taskStore';

export default function Tasks() {
    const [modalOpen, setModalOpen] = useState(false);
    const addTask = useTaskStore((state) => state.addTask);
    const loadTasks = useTaskStore((state) => state.loadTasks);

    // Load stored tasks when page loads
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Tasks</Typography>

            {/* Task Controls */}
            <TaskControls openModal={() => setModalOpen(true)} />

            {/* Task List */}
            <TaskList />

            {/* Task Modal */}
            <DynamicModal open={modalOpen} handleClose={() => setModalOpen(false)} saveTask={addTask} />
        </Box>
    );
}
