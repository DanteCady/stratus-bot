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

	// ** Add Profile **
	addProfile: (profile) =>
		set((state) => {
			const updatedProfiles = [...state.profiles, profile];
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

	// ** Select Profile Group **
	selectProfileGroup: (group) =>
		set(() => {
			localStorage.setItem('selectedGroup', JSON.stringify(group));
			return { selectedGroup: group };
		}),
}));

export default useProfileStore;
