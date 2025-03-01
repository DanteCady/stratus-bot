import { create } from 'zustand';

const useProxyStore = create((set, get) => ({
	proxyGroups: [],
	selectedProxyGroup: null,
	proxies: [],
	openModal: false,
	selectedProxy: null,

	// Open Modal (for New or Edit)
	openProxyModal: (proxy = null) =>
		set({ openModal: true, selectedProxy: proxy }),

	// Close Modal
	closeProxyModal: () => set({ openModal: false, selectedProxy: null }),

	// Add Proxies
	addProxies: async (proxyList) => {
		try {
			const selectedGroup = get().selectedProxyGroup;
			if (!selectedGroup?.proxy_group_id) {
				throw new Error('No proxy group selected');
			}

			const response = await fetch('/api/proxies', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					proxy_group_id: selectedGroup.proxy_group_id,
					proxies: proxyList,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to add proxies');
			}

			// Refresh proxies list
			await get().fetchProxies(selectedGroup.proxy_group_id);
			return data;
		} catch (error) {
			console.error('❌ Error adding proxies:', error);
			throw new Error(`Failed to add proxies: ${error.message}`);
		}
	},

	// Fetch Proxies for Group
	fetchProxies: async (proxy_group_id) => {
		try {
			const response = await fetch(`/api/proxies?groupId=${proxy_group_id}`);
			if (!response.ok) throw new Error('Failed to fetch proxies');

			const { proxies } = await response.json();
			set({ proxies });
		} catch (error) {
			console.error('❌ Error fetching proxies:', error);
		}
	},

	// Delete Proxy
	deleteProxy: async (proxy_id) => {
		try {
			const response = await fetch(`/api/proxies/${proxy_id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete proxy');

			// Refresh proxies list
			await get().fetchProxies(get().selectedProxyGroup.proxy_group_id);
		} catch (error) {
			console.error('❌ Error deleting proxy:', error);
			throw error;
		}
	},

	// Fetch Proxy Groups
	fetchProxyGroups: async () => {
		try {
			const response = await fetch('/api/proxy-groups');
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to fetch proxy groups');
			}

			const { proxyGroups } = await response.json();
			if (!proxyGroups || proxyGroups.length === 0) {
				// If no groups exist, create a default group
				await get().addProxyGroup('Default');
				return;
			}

			// Ensure default group is first
			const sortedGroups = proxyGroups.sort((a, b) =>
				a.is_default ? -1 : b.is_default ? 1 : 0
			);

			set({
				proxyGroups: sortedGroups,
				selectedProxyGroup: sortedGroups[0],
			});

			// Fetch proxies for the selected group
			if (sortedGroups[0]) {
				await get().fetchProxies(sortedGroups[0].proxy_group_id);
			}
		} catch (error) {
			console.error('❌ Error fetching proxy groups:', error);
			throw error;
		}
	},

	// Add Proxy Group
	addProxyGroup: async (name) => {
		try {
			const response = await fetch('/api/proxy-groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) throw new Error('Failed to create proxy group');

			await get().fetchProxyGroups();
		} catch (error) {
			console.error('❌ Error creating proxy group:', error);
			throw error;
		}
	},

	// Select Proxy Group
	selectProxyGroup: (group) => {
		set({ selectedProxyGroup: group });
		get().fetchProxies(group.proxy_group_id);
	},
	
	// Delete Proxy Group
deleteProxyGroup: async (proxyGroupId) => {  // 🔹 Fix param to use `proxyGroupId`
    try {
        const response = await fetch(`/api/proxy-groups/${proxyGroupId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete proxy group');

        await get().fetchProxyGroups();
    } catch (error) {
        console.error('❌ Error deleting proxy group:', error);
        throw error;
    }
},

// Duplicate Proxy Group
duplicateProxyGroup: async (proxyGroupId) => {  // 🔹 Fix param to use `proxyGroupId`
    try {
        const response = await fetch(`/api/proxy-groups/${proxyGroupId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to duplicate proxy group');
        }

        // Refresh the groups list
        await get().fetchProxyGroups();
    } catch (error) {
        console.error('Error duplicating proxy group:', error);
        throw error;
    }
},

}));

export default useProxyStore;
