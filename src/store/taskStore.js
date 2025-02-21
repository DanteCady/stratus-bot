import { create } from 'zustand';

const DEFAULT_GROUP = { id: 1, name: "Default Group" };

const useTaskStore = create((set) => ({
    // ** Load from localStorage or set defaults **
    taskGroups: JSON.parse(localStorage.getItem('taskGroups')) || [DEFAULT_GROUP],
    selectedTaskGroup: JSON.parse(localStorage.getItem('selectedTaskGroup')) || DEFAULT_GROUP,
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],

    // ** Initialize Store on Load **
    initializeStore: () => {
        if (typeof window !== 'undefined') {
            const storedGroups = JSON.parse(localStorage.getItem('taskGroups')) || [DEFAULT_GROUP];
            const storedSelectedGroup = JSON.parse(localStorage.getItem('selectedTaskGroup')) || DEFAULT_GROUP;
            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

            set({
                taskGroups: storedGroups,
                selectedTaskGroup: storedSelectedGroup,
                tasks: storedTasks,
            });
        }
    },

    // ** Add Task Group (Ensuring Uniqueness) **
    addTaskGroup: (group) => set((state) => {
        const updatedGroups = [...state.taskGroups, group];
        localStorage.setItem('taskGroups', JSON.stringify(updatedGroups));
        return { taskGroups: updatedGroups };
    }),

    // ** Select Task Group (Ensure Persistence) **
    setSelectedTaskGroup: (group) => set(() => {
        localStorage.setItem('selectedTaskGroup', JSON.stringify(group));
        return { selectedTaskGroup: group };
    }),

    // ** Rename Task Group (Only Allowed for Non-Default) **
    renameTaskGroup: (groupId, newName) => set((state) => {
        const updatedGroups = state.taskGroups.map((group) =>
            group.id === groupId ? { ...group, name: newName } : group
        );
        localStorage.setItem('taskGroups', JSON.stringify(updatedGroups));
        return { taskGroups: updatedGroups };
    }),

    // ** Delete Task Group (Cannot Delete Default) **
    deleteTaskGroup: (groupId) => set((state) => {
        if (groupId === DEFAULT_GROUP.id) return state; // Prevent deletion of default
        const updatedGroups = state.taskGroups.filter(group => group.id !== groupId);
        const newSelectedGroup = updatedGroups.length > 0 ? updatedGroups[0] : DEFAULT_GROUP;

        localStorage.setItem('taskGroups', JSON.stringify(updatedGroups));
        localStorage.setItem('selectedTaskGroup', JSON.stringify(newSelectedGroup));

        return { taskGroups: updatedGroups, selectedTaskGroup: newSelectedGroup };
    }),

    // ** Add Task to Selected Group **
    addTask: (task) => set((state) => {
        const updatedTasks = [...state.tasks, { ...task, groupId: state.selectedTaskGroup.id }];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // ** Delete Task **
    deleteTask: (taskId) => set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

    // ** Edit Task **
    editTask: (updatedTask) => set((state) => {
        const updatedTasks = state.tasks.map(task =>
            task.id === updatedTask.id ? { ...updatedTask } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return { tasks: updatedTasks };
    }),

}));

export default useTaskStore;
