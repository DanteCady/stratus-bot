import { create } from 'zustand';

const useProxyStore = create((set) => ({
	proxies: JSON.parse(localStorage.getItem('proxies')) || [],
	proxyGroups: JSON.parse(localStorage.getItem('proxyGroups')) || [
		{ id: 1, name: 'Default Group' },
	],
	selectedGroup: JSON.parse(localStorage.getItem('selectedProxyGroup')) || {
		id: 1,
		name: 'Default Group',
	},

	// ** Add Proxies (Fixes N/A Issue) **
	addProxies: (proxyList) =>
		set((state) => {
			const newProxies = proxyList
				.map((proxy) => proxy.trim()) // Trim spaces
				.filter((proxy) => proxy.length > 0) // Remove empty entries
				.map((proxy) => {
					return {
						id: Date.now() + Math.random(),
						fullProxy: proxy, // Store entire proxy string
						status: 'Untested',
					};
				});

			const updatedProxies = [...state.proxies, ...newProxies];
			localStorage.setItem('proxies', JSON.stringify(updatedProxies));
			return { proxies: updatedProxies };
		}),

	// ** Delete Single Proxy **
	deleteProxy: (proxyId) =>
		set((state) => {
			const updatedProxies = state.proxies.filter(
				(proxy) => proxy.id !== proxyId
			);
			localStorage.setItem('proxies', JSON.stringify(updatedProxies));
			return { proxies: updatedProxies };
		}),

	// ** Delete All Proxies **
	deleteAllProxies: () =>
		set(() => {
			localStorage.removeItem('proxies');
			return { proxies: [] };
		}),

	// ** Clear Bad Proxies **
	clearBadProxies: () =>
		set((state) => {
			const updatedProxies = state.proxies.filter(
				(proxy) => proxy.status !== 'Bad'
			);
			localStorage.setItem('proxies', JSON.stringify(updatedProxies));
			return { proxies: updatedProxies };
		}),

	// ** Select Proxy Group **
	selectProxyGroup: (group) =>
		set(() => {
			localStorage.setItem('selectedProxyGroup', JSON.stringify(group));
			return { selectedGroup: group };
		}),
}));

export default useProxyStore;
