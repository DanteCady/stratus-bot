import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
	taskGroups: [],
	selectedTaskGroup: null,
	tasks: [],

	addTask: async (taskData) => {
		try {
			const state = get();
			const { selectedTaskGroup } = state;

			if (!selectedTaskGroup?.task_group_id) {
				console.error('❌ Error: No task group selected. Cannot create task.');
				return;
			}

			console.log(
				'🔄 Creating task in group:',
				selectedTaskGroup.task_group_id
			);

			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					task_group_id: selectedTaskGroup.task_group_id,
					...taskData,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to create task. Server responded: ${errorText}`
				);
			}

			const newTask = await response.json();
			console.log('✅ Task created successfully:', newTask);

			// Fetch updated tasks after creation
			await get().fetchTasks(selectedTaskGroup.task_group_id);
		} catch (error) {
			console.error('❌ Error creating task:', error);
		}
	},

	// Fetch Tasks for Selected Group
	fetchTasks: async (groupId) => {
		try {
			if (!groupId) {
				console.error('❌ Error: Missing groupId for fetching tasks.');
				return;
			}

			console.log(`🔍 Fetching tasks for group: ${groupId}`);

			const response = await fetch(`/api/tasks?groupId=${groupId}`);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to fetch tasks. Server responded: ${errorText}`
				);
			}

			const { tasks } = await response.json();

			// Update state with fetched tasks
			set({ tasks });

			// After creating a task, fetch the tasks again
			if (tasks.length === 0) {
				console.log('No tasks found for this group');
			}
		} catch (error) {
			console.error('❌ Error fetching tasks:', error);
			set({ tasks: [] }); // Reset tasks on error
		}
	},

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
			const defaultGroup =
				taskGroups.find((group) => group.name === 'Default') || taskGroups[0];
			set({ selectedTaskGroup: defaultGroup });
		} catch (error) {
			console.error('Error fetching task groups:', error);
		}
	},

	// Select a Task Group
	setSelectedTaskGroup: (group) => {
		set({ selectedTaskGroup: group, tasks: [] }); // Clear previous tasks before fetching new ones
		if (group) {
			get().fetchTasks(group.task_group_id); // Fetch tasks for the selected group
		}
	},
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
				taskGroups: [...state.taskGroups, { task_group_id: taskGroupId, name }],
			}));
		} catch (error) {
			console.error('Error creating task group:', error);
		}
	},

	// Rename a task group
	renameTaskGroup: async (groupId, newName) => {
		if (!groupId) {
			console.error('❌ Error: groupId is undefined. Cannot rename.');
			return;
		}

		console.log('Renaming Task Group:', groupId, 'New Name:', newName);

		try {
			const response = await fetch(`/api/task-groups/${groupId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newName }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to rename task group');
			}

			set((state) => ({
				taskGroups: state.taskGroups.map((group) =>
					group.task_group_id === groupId ? { ...group, name: newName } : group
				),
			}));

			console.log('✅ Task group renamed successfully:', newName);
		} catch (error) {
			console.error('❌ Error renaming task group:', error);
		}
	},

	// Delete a task group (Default Group Cannot Be Deleted)

	deleteTaskGroup: async (groupId) => {
		const { taskGroups, selectedTaskGroup } = get();

		if (
			taskGroups.find((group) => group.task_group_id === groupId)?.name ===
			'Default'
		) {
			console.warn('🚨 Default Group cannot be deleted.');
			return;
		}

		try {
			const response = await fetch(`/api/task-groups/${groupId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete task group');

			set((state) => {
				const updatedGroups = state.taskGroups.filter(
					(group) => group.task_group_id !== groupId
				);
				return {
					taskGroups: updatedGroups,
					selectedTaskGroup:
						selectedTaskGroup?.task_group_id === groupId
							? updatedGroups.length > 0
								? updatedGroups[0]
								: null
							: selectedTaskGroup,
				};
			});
		} catch (error) {
			console.error('Error deleting task group:', error);
		}
	},

	// Duplicate a task group
	duplicateTaskGroup: async (groupId) => {
		try {
			const response = await fetch(`/api/task-groups/${groupId}/duplicate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!response.ok) throw new Error('Failed to duplicate task group');

			const { taskGroupId, newGroupName } = await response.json();

			console.log('✅ Task group duplicated successfully:', taskGroupId);

			// Fetch latest task groups and update state
			const updatedResponse = await fetch('/api/task-groups');
			if (!updatedResponse.ok)
				throw new Error('Failed to fetch updated task groups.');

			const { taskGroups } = await updatedResponse.json();

			set({ taskGroups });

			// Select the newly duplicated group
			const duplicatedGroup = taskGroups.find(
				(group) => group.task_group_id === taskGroupId
			);
			if (duplicatedGroup) {
				set({ selectedTaskGroup: duplicatedGroup });
			}
		} catch (error) {
			console.error('❌ Error duplicating task group:', error);
		}
	},
}));

export default useTaskStore;
