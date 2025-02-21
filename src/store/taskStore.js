import { create } from 'zustand';

// Function to safely get tasks from localStorage
const getStoredTasks = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }
    return []; // Return empty array if running on the server
};

const useTaskStore = create((set) => ({
    tasks: getStoredTasks(),

    // Add Task
    addTask: (task) => set((state) => {
        const updatedTasks = [...state.tasks, task];
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
        return { tasks: updatedTasks };
    }),

    // Delete Task
    deleteTask: (taskId) => set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
        return { tasks: updatedTasks };
    }),

    // Update Task Status
    updateTaskStatus: (taskId, status) => set((state) => {
        const updatedTasks = state.tasks.map(task =>
            task.id === taskId ? { ...task, status } : task
        );
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
        return { tasks: updatedTasks };
    }),

    // Load Tasks (Client-Side Only)
    loadTasks: () => set(() => ({
        tasks: getStoredTasks(),
    })),
}));

export default useTaskStore;
