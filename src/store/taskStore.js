import { create } from 'zustand';

const useTaskStore = create((set) => ({
    taskGroups: [],
    selectedTaskGroup: null,
    tasks: [],

    // Fetch Task Groups from API
    fetchTaskGroups: async () => {
        try {
            const response = await fetch('/api/task-groups');
            if (!response.ok) throw new Error('Failed to fetch task groups.');
    
            let { taskGroups } = await response.json();
    
            //  Remove any duplicate "Default" groups
            const seen = new Set();
            taskGroups = taskGroups.filter((group) => {
                const isDuplicate = seen.has(group.name);
                seen.add(group.name);
                return !isDuplicate;
            });
    
            set({ taskGroups });
    
            // Ensure we only have one "Default" group and select it
            const defaultGroup = taskGroups.find(group => group.name === 'Default') || taskGroups[0];
            set({ selectedTaskGroup: defaultGroup });
    
        } catch (error) {
            console.error('Error fetching task groups:', error);
        }
    },
    

    // Select a Task Group
    setSelectedTaskGroup: (group) => set({ selectedTaskGroup: group }),

    // Add a new task group
    addTaskGroup: async (name) => {
        try {
            const response = await fetch('/api/task-groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error('Failed to create task group');

            const { taskGroupId } = await response.json();
            set((state) => ({
                taskGroups: [...state.taskGroups, { id: taskGroupId, name }],
            }));
        } catch (error) {
            console.error('Error creating task group:', error);
        }
    },

    // Rename a task group
    renameTaskGroup: async (groupId, newName) => {
        try {
            const response = await fetch(`/api/task-groups/${groupId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
    
            if (!response.ok) throw new Error('Failed to rename task group');
    
            set((state) => ({
                taskGroups: state.taskGroups.map((group) =>
                    group.id === groupId ? { ...group, name: newName } : group
                ),
            }));
        } catch (error) {
            console.error('Error renaming task group:', error);
        }
    },
    

    // Delete a task group (Default Group Cannot Be Deleted)
    deleteTaskGroup: async (groupId) => {
        const { taskGroups, selectedTaskGroup } = get();

        if (taskGroups.find(group => group.id === groupId)?.name === 'Default') {
            console.warn('🚨 Default Group cannot be deleted.');
            return;
        }

        try {
            const response = await fetch(`/api/task-groups/${groupId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task group');

            set((state) => ({
                taskGroups: state.taskGroups.filter((group) => group.id !== groupId),
                selectedTaskGroup:
                    selectedTaskGroup.id === groupId
                        ? state.taskGroups.length > 1
                            ? state.taskGroups[0]
                            : null
                        : selectedTaskGroup,
            }));
        } catch (error) {
            console.error('Error deleting task group:', error);
        }
    },
}));

export default useTaskStore;
