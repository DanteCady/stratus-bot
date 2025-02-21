import { create } from 'zustand';

const useTaskStore = create((set) => ({
    tasks: JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('tasks') : '[]') || [],

    // Add Task
    addTask: (task) => set((state) => {
        const updatedTasks = [...state.tasks, task];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // Delete Single Task
    deleteTask: (taskId) => set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // Delete All Tasks
    deleteAllTasks: () => set(() => {
        localStorage.removeItem('tasks'); // Clear storage
        return { tasks: [] };
    }),

    // Edit Task
    editTask: (updatedTask) => set((state) => {
        const updatedTasks = state.tasks.map(task => 
            task.id === updatedTask.id ? { ...updatedTask } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // Update Task Status
    updateTaskStatus: (taskId, status) => set((state) => {
        const updatedTasks = state.tasks.map(task =>
            task.id === taskId ? { ...task, status } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // Load Tasks from LocalStorage (Client-Side Only)
    loadTasks: () => {
        if (typeof window !== 'undefined') {
            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            set({ tasks: storedTasks });
        }
    },
}));

export default useTaskStore;
