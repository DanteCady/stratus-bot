import { create } from 'zustand';

const useProfileStore = create((set, get) => ({
    profileGroups: [],
    selectedProfileGroup: null,
    profiles: [],

    // Fetch Profile Groups & Ensure "Default" Exists
    fetchProfileGroups: async () => {
        try {
            const response = await fetch('/api/profile-groups');
            if (!response.ok) throw new Error('Failed to fetch profile groups.');

            let { profileGroups } = await response.json();

            // Ensure "Default" group stays first
            profileGroups = profileGroups.sort((a, b) => 
                a.is_default ? -1 : b.is_default ? 1 : 0
            );

            set({ profileGroups });

            // Set selected profile group to "Default" if available
            const defaultGroup = profileGroups.find(group => group.is_default) || profileGroups[0];
            set({ selectedProfileGroup: defaultGroup });
        } catch (error) {
            console.error('❌ Error fetching profile groups:', error);
        }
    },

    // Fetch Profiles for Selected Group
    fetchProfiles: async (groupId) => {
        try {
            if (!groupId) return;
            const response = await fetch(`/api/profiles?groupId=${groupId}`);
            if (!response.ok) throw new Error('Failed to fetch profiles.');

            const { profiles } = await response.json();
            set({ profiles });
        } catch (error) {
            console.error('❌ Error fetching profiles:', error);
        }
    },

    // Select a Profile Group
    setSelectedProfileGroup: (group) => {
        set({ selectedProfileGroup: group });
        get().fetchProfiles(group.id);
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

            const { profileGroupId } = await response.json();
            set((state) => ({
                profileGroups: [...state.profileGroups, { id: profileGroupId, name }],
            }));
        } catch (error) {
            console.error('❌ Error creating profile group:', error);
        }
    },

    // Rename a Profile Group
    renameProfileGroup: async (groupId, newName) => {
        try {
            const response = await fetch(`/api/profile-groups/${groupId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error('Failed to rename profile group');

            set((state) => ({
                profileGroups: state.profileGroups.map((group) =>
                    group.id === groupId ? { ...group, name: newName } : group
                ),
            }));
        } catch (error) {
            console.error('❌ Error renaming profile group:', error);
        }
    },

    // Delete a Profile Group (Default Cannot Be Deleted)
    deleteProfileGroup: async (groupId) => {
        const { profileGroups, selectedProfileGroup } = get();

        if (profileGroups.find(group => group.id === groupId)?.is_default) {
            console.warn('🚨 Default Profile Group cannot be deleted.');
            return;
        }

        try {
            const response = await fetch(`/api/profile-groups/${groupId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete profile group');

            set((state) => {
                const updatedGroups = state.profileGroups.filter((group) => group.id !== groupId);
                return {
                    profileGroups: updatedGroups,
                    selectedProfileGroup:
                        selectedProfileGroup.id === groupId
                            ? updatedGroups.length > 0
                                ? updatedGroups[0]
                                : null
                            : selectedProfileGroup,
                };
            });
        } catch (error) {
            console.error('❌ Error deleting profile group:', error);
        }
    },

    // Duplicate a Profile Group (Including Profiles)
    duplicateProfileGroup: async (groupId) => {
        try {
            const response = await fetch(`/api/profile-groups/${groupId}/duplicate`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to duplicate profile group');

            await get().fetchProfileGroups(); // Ensure UI updates
        } catch (error) {
            console.error('❌ Error duplicating profile group:', error);
        }
    },

    // Create a New Profile
    addProfile: async (profileData) => {
        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) throw new Error('Failed to create profile');

            await get().fetchProfiles(profileData.profileGroupId);
        } catch (error) {
            console.error('❌ Error creating profile:', error);
        }
    },

    // Update an Existing Profile
    updateProfile: async (profileId, updatedData) => {
        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            await get().fetchProfiles(updatedData.profileGroupId);
        } catch (error) {
            console.error('❌ Error updating profile:', error);
        }
    },

    // Delete a Profile
    deleteProfile: async (profileId, profileGroupId) => {
        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete profile');

            await get().fetchProfiles(profileGroupId);
        } catch (error) {
            console.error('❌ Error deleting profile:', error);
        }
    },
}));

export default useProfileStore;
