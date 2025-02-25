import { create } from 'zustand';

const useAccountStore = create((set) => ({
	accountsByGroup: JSON.parse(localStorage.getItem('accountsByGroup')) || {
		1: [],
	},
	accountGroups: JSON.parse(localStorage.getItem('accountGroups')) || [
		{ id: 1, name: 'Default Group' },
	],
	selectedGroup: JSON.parse(localStorage.getItem('selectedAccountGroup')) || {
		id: 1,
		name: 'Default Group',
	},

	// ** Add Accounts - Fix Parsing Issue **
		// ** Add Multiple Accounts to Selected Group **
        addAccounts: (groupId, accountList) =>
            set((state) => {
                const updatedAccounts = {
                    ...state.accountsByGroup,
                    [groupId]: [...(state.accountsByGroup[groupId] || []), ...accountList],
                };
                localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
                return { accountsByGroup: updatedAccounts };
            }),

	// ** Update Account **
	updateAccount: (updatedAccount) =>
		set((state) => {
			const groupId = state.selectedGroup.id;
			if (!state.accountsByGroup[groupId]) return state; // Ensure group exists

			const updatedAccounts = {
				...state.accountsByGroup,
				[groupId]: state.accountsByGroup[groupId].map((account) =>
					account.id === updatedAccount.id
						? { ...account, ...updatedAccount }
						: account
				),
			};

			localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
			return { accountsByGroup: updatedAccounts };
		}),

	// ** Delete Single Account **
	deleteAccount: (accountId) =>
		set((state) => {
			const updatedAccounts = {
				...state.accountsByGroup,
				[state.selectedGroup.id]: state.accountsByGroup[
					state.selectedGroup.id
				].filter((account) => account.id !== accountId),
			};

			localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
			return { accountsByGroup: updatedAccounts };
		}),

	// ** Delete All Accounts in Group **
	deleteAllAccounts: () =>
		set((state) => {
			const updatedAccounts = {
				...state.accountsByGroup,
				[state.selectedGroup.id]: [],
			};

			localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
			return { accountsByGroup: updatedAccounts };
		}),

	// ** Add Account Group **
	addAccountGroup: (group) =>
		set((state) => {
			const updatedGroups = [...state.accountGroups, group];
			localStorage.setItem('accountGroups', JSON.stringify(updatedGroups));
			return { accountGroups: updatedGroups };
		}),

	// ** Select Account Group **
	selectAccountGroup: (group) =>
		set(() => {
			localStorage.setItem('selectedAccountGroup', JSON.stringify(group));
			return { selectedGroup: { ...group } }; // Ensures reactivity
		}),
}));

export default useAccountStore;
