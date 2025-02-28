import { create } from 'zustand';

const useAccountStore = create((set, get) => ({
	accountGroups: [],
	selectedGroup: null,
	accounts: [],

	// Fetch account groups from API
	fetchAccountGroups: async () => {
		try {
			const response = await fetch('/api/account-groups');
			if (!response.ok) throw new Error('Failed to fetch account groups.');

			const { accountGroups } = await response.json();
			set({ accountGroups });

			// Ensure "Default" group is always selected if available
			const defaultGroup =
				accountGroups.find((group) => group.name === 'Default') ||
				accountGroups[0];

			// 🔹 Set selected group using `account_group_id` instead of `id`
			set({ selectedGroup: defaultGroup });
		} catch (error) {
			console.error('❌ Error fetching account groups:', error);
		}
	},

	// Create a new account group
	addAccountGroup: async (name) => {
		try {
			const response = await fetch('/api/account-groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) throw new Error('Failed to create account group.');

			const { account_group_id } = await response.json();

			// 🔹 Update local state to reference `account_group_id`
			set((state) => ({
				accountGroups: [...state.accountGroups, { account_group_id, name }],
			}));

			return account_group_id;
		} catch (error) {
			console.error('❌ Error creating account group:', error);
			throw error;
		}
	},

	// Select an account group
	selectAccountGroup: async (group) => {
		// 🔹 Use `account_group_id` instead of `id`
		set({ selectedGroup: group, accounts: [] });
		if (group?.account_group_id) {
			get().fetchAccounts(group.account_group_id);
		}
	},

	// Fetch accounts for selected group
	fetchAccounts: async (groupId) => {
		try {
			const response = await fetch(`/api/accounts?groupId=${groupId}`);
			if (!response.ok) throw new Error('Failed to fetch accounts.');

			const { accounts } = await response.json();
			set({ accounts });
		} catch (error) {
			console.error('❌ Error fetching accounts:', error);
			set({ accounts: [] });
		}
	},

	// Add account to selected group
	addAccount: async (accountData) => {
		try {
			const { selectedGroup } = get();
			if (!selectedGroup?.account_group_id) {
				throw new Error('No account group selected');
			}

			const response = await fetch('/api/accounts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					account_group_id: selectedGroup.account_group_id, // 🔹 Fix here
					...accountData,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to create account: ${errorText}`);
			}

			// Refresh accounts after creation
			await get().fetchAccounts(selectedGroup.account_group_id);
		} catch (error) {
			console.error('❌ Error creating account:', error);
			throw error;
		}
	},
}));

export default useAccountStore;
