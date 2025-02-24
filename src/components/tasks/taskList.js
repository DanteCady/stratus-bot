'use client';
import { useEffect, useState } from 'react';
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
const { tasks, fetchTasks, selectedTaskGroup } = useTaskStore();

    const [selectedTasks, setSelectedTasks] = useState([]);

    // Fetch tasks whenever the selected task group changes
    useEffect(() => {
        if (fetchTasks) {
            fetchTasks();
        }
    }, []);
    
    // Handle task selection
    const handleSelectTask = (taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        );
    };

    // Select / Deselect All Tasks
    const handleSelectAll = () => {
        if (selectedTasks.length === tasks?.length) {
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
                                checked={selectedTasks.length === tasks?.length && tasks?.length > 0}
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
                    {tasks?.length > 0 ? (
                        tasks.map((task) => (
                            <TableRow key={task.id} selected={selectedTasks.includes(task.id)}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => handleSelectTask(task.id)}
                                    />
                                </TableCell>
                                <TableCell>{task.site}</TableCell>
                                <TableCell>{task.product}</TableCell>
                                <TableCell>{task.proxy || 'None'}</TableCell>
                                <TableCell>{task.solver || 'N/A'}</TableCell>
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No tasks found in {selectedTaskGroup?.name || 'this group'}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
