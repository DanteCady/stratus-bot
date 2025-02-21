'use client';
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useTaskStore from '@/store/taskStore';

export default function TaskList({ openEditModal }) {
    const tasks = useTaskStore((state) => state.tasks);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const deleteMultipleTasks = useTaskStore((state) => state.deleteMultipleTasks);

    const [selectedTasks, setSelectedTasks] = useState([]);

    // Toggle selection for a single task
    const handleSelectTask = (taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        );
    };

    // Select / Deselect All Tasks
    const handleSelectAll = () => {
        if (selectedTasks.length === tasks.length) {
            setSelectedTasks([]); // Unselect all
        } else {
            setSelectedTasks(tasks.map((task) => task.id)); // Select all
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Site</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Proxy</TableCell>
                        <TableCell>Solver</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id} selected={selectedTasks.includes(task.id)}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedTasks.includes(task.id)}
                                    onChange={() => handleSelectTask(task.id)}
                                />
                            </TableCell>
                            <TableCell>{task.site}</TableCell>
                            <TableCell>{task.product}</TableCell>
                            <TableCell>{task.proxy}</TableCell>
                            <TableCell>{task.solver}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => openEditModal(task)} color="secondary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => deleteTask(task.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
