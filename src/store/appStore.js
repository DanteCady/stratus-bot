import { create } from 'zustand';

const useAppStore = create((set, get) => ({
    initialized: false,
    system: {
        shops: [],
        sites: [],
        regions: [],
        modes: [],
    },
    userData: {
        taskGroups: [],
        profileGroups: [],
        proxyGroups: [],
        tasks: [],
        profiles: [],
        proxies: [],
    },

    // Fetch user data from the API endpoint
    fetchUserData: async () => {
        try {
            console.log("🔄 Fetching user data...");
            const response = await fetch('/api/user/data');
            const userData = await response.json();

            if (response.ok) {
                set({ userData, initialized: true });
                console.log("✅ Zustand Store Updated with User Data:", userData);
            } else {
                console.error("❌ Error fetching user data:", userData.error);
            }
        } catch (error) {
            console.error("❌ Failed to fetch user data:", error);
        }
    }
}));

export default useAppStore;
