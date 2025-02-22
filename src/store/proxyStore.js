import { create } from 'zustand';

const useProxyStore = create((set) => ({
    proxies: JSON.parse(localStorage.getItem('proxies')) || [],
    proxyGroups: JSON.parse(localStorage.getItem('proxyGroups')) || [{ id: 1, name: "Default Group" }],
    selectedGroup: JSON.parse(localStorage.getItem('selectedProxyGroup')) || { id: 1, name: "Default Group" },

    // Add Proxy
    addProxy: (proxy) =>
        set((state) => {
            const updatedProxies = [...state.proxies, proxy];
            localStorage.setItem('proxies', JSON.stringify(updatedProxies));
            return { proxies: updatedProxies };
        }),

    // Delete Proxy
    deleteProxy: (proxyId) =>
        set((state) => {
            const updatedProxies = state.proxies.filter(proxy => proxy.id !== proxyId);
            localStorage.setItem('proxies', JSON.stringify(updatedProxies));
            return { proxies: updatedProxies };
        }),

    // Delete All Proxies
    deleteAllProxies: () =>
        set(() => {
            localStorage.removeItem('proxies');
            return { proxies: [] };
        }),

    // Clear Bad Proxies (Example: Remove those marked as failed)
    clearBadProxies: () =>
        set((state) => {
            const updatedProxies = state.proxies.filter(proxy => proxy.status !== "Failed");
            localStorage.setItem('proxies', JSON.stringify(updatedProxies));
            return { proxies: updatedProxies };
        }),

    // Test Proxy (Simulated Status Change)
    testProxy: (proxyId) =>
        set((state) => {
            const updatedProxies = state.proxies.map(proxy =>
                proxy.id === proxyId ? { ...proxy, status: Math.random() > 0.5 ? "Working" : "Failed" } : proxy
            );
            localStorage.setItem('proxies', JSON.stringify(updatedProxies));
            return { proxies: updatedProxies };
        }),

    // Add Proxy Group
    addProxyGroup: (group) =>
        set((state) => {
            const updatedGroups = [...state.proxyGroups, group];
            localStorage.setItem('proxyGroups', JSON.stringify(updatedGroups));
            return { proxyGroups: updatedGroups };
        }),

    // Delete Proxy Group
    deleteProxyGroup: (groupId) =>
        set((state) => {
            const updatedGroups = state.proxyGroups.filter(group => group.id !== groupId);
            localStorage.setItem('proxyGroups', JSON.stringify(updatedGroups));
            return { proxyGroups: updatedGroups };
        }),

    // Select Proxy Group
    selectProxyGroup: (group) =>
        set(() => {
            localStorage.setItem('selectedProxyGroup', JSON.stringify(group));
            return { selectedGroup: group };
        }),
}));

export default useProxyStore;
