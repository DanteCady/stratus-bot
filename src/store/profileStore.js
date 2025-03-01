import { create } from 'zustand';

const useProfileStore = create((set, get) => ({
	profileGroups: [],
	selectedProfileGroup: null,
	profiles: [],
	currentProfile: null,

	// Fetch Profile Groups
	fetchProfileGroups: async () => {
		try {
			const response = await fetch('/api/profile-groups');
			if (!response.ok) throw new Error('Failed to fetch profile groups');

			let { profileGroups } = await response.json();

			// Ensure "Default" group stays first
			profileGroups = profileGroups.sort((a, b) =>
				a.is_default ? -1 : b.is_default ? 1 : 0
			);

			set({ profileGroups });

			// Set selected profile group to "Default" if none selected
			const defaultGroup =
				profileGroups.find((group) => group.is_default) || profileGroups[0];
			if (!get().selectedProfileGroup) {
				set({ selectedProfileGroup: defaultGroup });
			}
		} catch (error) {
			console.error('Error fetching profile groups:', error);
		}
	},

	// Fetch Profiles for Selected Group
	fetchProfiles: async (profile_group_id) => {
		try {
			if (!profile_group_id) return;
			const response = await fetch(`/api/profiles?groupId=${profile_group_id}`);
			if (!response.ok) throw new Error('Failed to fetch profiles.');

			const { profiles } = await response.json();
			set({ profiles });
		} catch (error) {
			console.error('❌ Error fetching profiles:', error);
		}
	},

	// Set Selected Profile Group
	setSelectedProfileGroup: (group) => {
		set({ selectedProfileGroup: group });
		get().fetchProfiles(group.profile_group_id);
	},

	// Create a New Profile Group
	addProfileGroup: async (name) => {
		try {
			const response = await fetch('/api/profile-groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) throw new Error('Failed to create profile group');

			const { profile_group_id } = await response.json();
			set((state) => ({
				profileGroups: [...state.profileGroups, { profile_group_id, name }],
			}));
		} catch (error) {
			console.error('❌ Error creating profile group:', error);
		}
	},

	// Rename Profile Group
	renameProfileGroup: async (profile_group_id, newName) => {
		try {
			const response = await fetch(`/api/profile-groups/${profile_group_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newName }),
			});

			if (!response.ok) throw new Error('Failed to rename profile group');

			set((state) => ({
				profileGroups: state.profileGroups.map((group) =>
					group.profile_group_id === profile_group_id
						? { ...group, name: newName }
						: group
				),
			}));
		} catch (error) {
			console.error('❌ Error renaming profile group:', error);
		}
	},

	// Delete Profile Group
	deleteProfileGroup: async (profile_group_id) => {
		try {
			const response = await fetch(`/api/profile-groups/${profile_group_id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete profile group');

			set((state) => ({
				profileGroups: state.profileGroups.filter(
					(group) => group.profile_group_id !== profile_group_id
				),
				selectedProfileGroup:
					state.selectedProfileGroup?.profile_group_id === profile_group_id
						? null
						: state.selectedProfileGroup,
			}));
		} catch (error) {
			console.error('❌ Error deleting profile group:', error);
		}
	},

	// Add Profile
	addProfile: async (profileData) => {
		try {
			const { selectedProfileGroup } = get();
			if (!selectedProfileGroup) {
				throw new Error('No profile group selected');
			}

			const response = await fetch('/api/profiles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...profileData,
					profileGroupId: selectedProfileGroup.profile_group_id,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create profile');
			}

			// Refresh profiles for the current group
			await get().fetchProfiles(selectedProfileGroup.profile_group_id);
			return response.json();
		} catch (error) {
			console.error('Error adding profile:', error);
			throw error;
		}
	},
}));

export default useProfileStore;
