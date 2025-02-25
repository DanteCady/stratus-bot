'use client';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TaskControls from '@/components/tasks/taskControls';
import TaskList from '@/components/tasks/taskList';
import TaskSidebar from '@/components/tasks/taskSidebar';
import DynamicModal from '@/components/global/dynamicModal';
import useTaskStore from '@/store/taskStore';

export default function Tasks() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { tasks, selectedTaskGroup, fetchTaskGroups, addTask, editTask } = useTaskStore();

    // Load store data on mount
    useEffect(() => {
        if (fetchTaskGroups) {
            fetchTaskGroups();
        }
    }, []);
    

    const handleOpenModal = (task = null) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    // Filter tasks based on selected group
    const filteredTasks = selectedTaskGroup
        ? tasks.filter((task) => task.groupId === selectedTaskGroup.id)
        : [];

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar for Task Groups */}
            <TaskSidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Tasks ({selectedTaskGroup?.name || "No Group Selected"})
                </Typography>

                {/* Task Controls */}
                <TaskControls openModal={() => handleOpenModal()} />

                {/* Task List */}
                <TaskList openEditModal={handleOpenModal} tasks={filteredTasks} />

                {/* Task Modal */}
                <DynamicModal
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    saveTask={editingTask ? editTask : addTask}
                    editingTask={editingTask}
                />
            </Box>
        </Box>
    );
}
