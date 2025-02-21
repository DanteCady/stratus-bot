import { create } from 'zustand';

const useProfileStore = create((set) => ({
    // Load from localStorage or set default values
    profiles: JSON.parse(localStorage.getItem('profiles')) || [],
    profileGroups: JSON.parse(localStorage.getItem('profileGroups')) || [{ id: 1, name: "Default Group" }],
    selectedGroup: JSON.parse(localStorage.getItem('selectedGroup')) || { id: 1, name: "Default Group" },

    // Modal State
    openModal: false,
    selectedProfile: null,

    // Open Modal (for New or Edit)
    openProfileModal: (profile = null) =>
        set({ openModal: true, selectedProfile: profile }),

    // Close Modal
    closeProfileModal: () => set({ openModal: false, selectedProfile: null }),

    // ** Add Profile (Now assigns it to the selected group) **
    addProfile: (profile) =>
        set((state) => {
            const updatedProfiles = [...state.profiles, { ...profile, groupId: state.selectedGroup.id }];
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
            return { profiles: updatedProfiles };
        }),

    // ** Delete Profile **
    deleteProfile: (profileId) =>
        set((state) => {
            const updatedProfiles = state.profiles.filter(profile => profile.id !== profileId);
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
            return { profiles: updatedProfiles };
        }),

    // ** Update Profile **
    updateProfile: (updatedProfile) =>
        set((state) => {
            const updatedProfiles = state.profiles.map((profile) =>
                profile.id === updatedProfile.id ? updatedProfile : profile
            );
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
            return { profiles: updatedProfiles };
        }),

    // ** Load Profiles (when app starts) **
    loadProfiles: () =>
        set(() => ({
            profiles: JSON.parse(localStorage.getItem('profiles')) || [],
        })),

    // ** Profile Group Management **
    addProfileGroup: (group) =>
        set((state) => {
            const updatedGroups = [...state.profileGroups, group];
            localStorage.setItem('profileGroups', JSON.stringify(updatedGroups));
            return { profileGroups: updatedGroups };
        }),

    deleteProfileGroup: (groupId) =>
        set((state) => {
            const updatedGroups = state.profileGroups.filter(group => group.id !== groupId);
            localStorage.setItem('profileGroups', JSON.stringify(updatedGroups));
            return { profileGroups: updatedGroups };
        }),

    // ** Select a Profile Group (Filters Profiles) **
    selectProfileGroup: (group) =>
        set((state) => {
            localStorage.setItem('selectedGroup', JSON.stringify(group));
            return { selectedGroup: group };
        }),

    // ** Get Profiles for Selected Group (Filtering Logic) **
    getProfilesForSelectedGroup: () =>
        JSON.parse(localStorage.getItem('profiles'))?.filter(profile => profile.groupId === JSON.parse(localStorage.getItem('selectedGroup'))?.id) || [],

    // ** Duplicate a Profile (Keeps It in the Same Group) **
    duplicateProfile: (profileId) =>
        set((state) => {
            const profileToCopy = state.profiles.find(profile => profile.id === profileId);
            if (!profileToCopy) return state;

            // Generate a new unique ID for the duplicate
            const newId = Date.now();

            // Find existing copies to determine the number
            const baseName = profileToCopy.profileName.replace(/\(\d+\)$/, "").trim();
            const existingCopies = state.profiles.filter(p => p.profileName.startsWith(baseName));
            const copyNumber = existingCopies.length + 1;

            const duplicatedProfile = {
                ...profileToCopy,
                id: newId,
                profileName: `${baseName} (${copyNumber})`, // Append copy number
                groupId: profileToCopy.groupId, // Maintain the group
            };

            const updatedProfiles = [...state.profiles, duplicatedProfile];
            localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
            return { profiles: updatedProfiles };
        }),

}));

export default useProfileStore;
