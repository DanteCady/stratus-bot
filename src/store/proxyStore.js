import { create } from 'zustand';

const useProxyStore = create((set, get) => ({
	proxyGroups: JSON.parse(localStorage.getItem('proxyGroups')) || [{ id: 1, name: "Default Group" }],
	selectedGroup: JSON.parse(localStorage.getItem('selectedProxyGroup')) || { id: 1, name: "Default Group" },
	proxiesByGroup: JSON.parse(localStorage.getItem('proxiesByGroup')) || { 1: [] }, // Store proxies per group

	// ** Add Proxies to Selected Group **
	addProxies: (proxyList) =>
		set((state) => {
			const { selectedGroup, proxiesByGroup } = state;
			const groupId = selectedGroup.id;

			const newProxies = proxyList
				.filter((proxy) => typeof proxy === 'string' && proxy.includes(':')) // Ensure valid format
				.map((proxy) => {
					const parts = proxy.trim().split(':');
					const ip = parts[0];
					const port = parts[1] || '';

					return {
						id: Date.now() + Math.random(),
						address: `${ip}:${port}`,
						status: 'Untested',
					};
				});

			const updatedProxiesByGroup = {
				...proxiesByGroup,
				[groupId]: [...(proxiesByGroup[groupId] || []), ...newProxies],
			};

			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			return { proxiesByGroup: updatedProxiesByGroup };
		}),

	// ** Delete Single Proxy from Selected Group **
	deleteProxy: (proxyId) =>
		set((state) => {
			const { selectedGroup, proxiesByGroup } = state;
			const groupId = selectedGroup.id;

			const updatedProxies = (proxiesByGroup[groupId] || []).filter((proxy) => proxy.id !== proxyId);
			const updatedProxiesByGroup = { ...proxiesByGroup, [groupId]: updatedProxies };

			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			return { proxiesByGroup: updatedProxiesByGroup };
		}),

	// ** Delete All Proxies in Selected Group **
	deleteAllProxies: () =>
		set((state) => {
			const { selectedGroup, proxiesByGroup } = state;
			const groupId = selectedGroup.id;

			const updatedProxiesByGroup = { ...proxiesByGroup, [groupId]: [] };
			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			return { proxiesByGroup: updatedProxiesByGroup };
		}),

	// ** Clear Bad Proxies in Selected Group **
	clearBadProxies: () =>
		set((state) => {
			const { selectedGroup, proxiesByGroup } = state;
			const groupId = selectedGroup.id;

			const updatedProxies = (proxiesByGroup[groupId] || []).filter((proxy) => proxy.status !== 'Bad');
			const updatedProxiesByGroup = { ...proxiesByGroup, [groupId]: updatedProxies };

			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			return { proxiesByGroup: updatedProxiesByGroup };
		}),

	// ** Add Proxy Group **
	addProxyGroup: (group) =>
		set((state) => {
			const updatedGroups = [...state.proxyGroups, group];
			const updatedProxiesByGroup = { ...state.proxiesByGroup, [group.id]: [] }; // Initialize empty proxies for the new group

			localStorage.setItem('proxyGroups', JSON.stringify(updatedGroups));
			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			return { proxyGroups: updatedGroups, proxiesByGroup: updatedProxiesByGroup };
		}),

	// ** Delete Proxy Group (except Default Group) **
	deleteProxyGroup: (groupId) =>
		set((state) => {
			if (groupId === 1) return state; // Prevent deleting default group

			const updatedGroups = state.proxyGroups.filter((group) => group.id !== groupId);
			const updatedProxiesByGroup = { ...state.proxiesByGroup };
			delete updatedProxiesByGroup[groupId]; // Remove proxies of deleted group

			// Reset selection if the deleted group was selected
			let newSelectedGroup = state.selectedGroup.id === groupId ? { id: 1, name: "Default Group" } : state.selectedGroup;

			localStorage.setItem('proxyGroups', JSON.stringify(updatedGroups));
			localStorage.setItem('proxiesByGroup', JSON.stringify(updatedProxiesByGroup));
			localStorage.setItem('selectedProxyGroup', JSON.stringify(newSelectedGroup));

			return { proxyGroups: updatedGroups, proxiesByGroup: updatedProxiesByGroup, selectedGroup: newSelectedGroup };
		}),

	// ** Select Proxy Group **
	selectProxyGroup: (group) =>
		set(() => {
			localStorage.setItem('selectedProxyGroup', JSON.stringify(group));
			return { selectedGroup: { ...group } }; // Ensures reactivity
		}),
}));

export default useProxyStore;
