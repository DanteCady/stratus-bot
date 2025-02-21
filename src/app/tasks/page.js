'use client';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TaskControls from '@/components/tasks/taskControls';
import TaskList from '@/components/tasks/taskList';
import DynamicModal from '@/components/global/dynamicModal';
import useTaskStore from '@/store/taskStore';

export default function Tasks() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const addTask = useTaskStore((state) => state.addTask);
    const editTask = useTaskStore((state) => state.editTask);
    const loadTasks = useTaskStore((state) => state.loadTasks);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleOpenModal = (task = null) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Tasks</Typography>

            {/* Task Controls */}
            <TaskControls openModal={() => handleOpenModal()} />

            {/* Task List */}
            <TaskList openEditModal={handleOpenModal} />

            {/* Task Modal */}
            <DynamicModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                saveTask={editingTask ? editTask : addTask}
                editingTask={editingTask}
            />
        </Box>
    );
}
