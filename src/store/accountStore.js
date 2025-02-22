import { create } from 'zustand';

const useAccountStore = create((set) => ({
	accountsByGroup: JSON.parse(localStorage.getItem('accountsByGroup')) || { 1: [] },
	accountGroups: JSON.parse(localStorage.getItem('accountGroups')) || [{ id: 1, name: "Default Group" }],
	selectedGroup: JSON.parse(localStorage.getItem('selectedAccountGroup')) || { id: 1, name: "Default Group" },

	// ** Add Accounts **
	addAccounts: (accountList) =>
		set((state) => {
			const groupId = state.selectedGroup.id;
			const newAccounts = accountList.map((account) => {
				const parts = account.trim().split(":::");
				return {
					id: Date.now() + Math.random(),
					site: parts[0] || 'Unknown',
					username: parts[1] || 'N/A',
					password: parts[2] || 'N/A',
					proxy: parts[3] || 'N/A',
					status: 'Pending',
				};
			});

			const updatedAccounts = {
				...state.accountsByGroup,
				[groupId]: [...(state.accountsByGroup[groupId] || []), ...newAccounts],
			};

			localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
			return { accountsByGroup: updatedAccounts };
		}),

	// ** Delete Single Account **
	deleteAccount: (accountId) =>
		set((state) => {
			const groupId = state.selectedGroup.id;
			const updatedAccounts = state.accountsByGroup[groupId].filter((acc) => acc.id !== accountId);
			const newState = { ...state.accountsByGroup, [groupId]: updatedAccounts };

			localStorage.setItem('accountsByGroup', JSON.stringify(newState));
			return { accountsByGroup: newState };
		}),

	// ** Delete All Accounts in Group **
	deleteAllAccounts: () =>
		set((state) => {
			const groupId = state.selectedGroup.id;
			const newState = { ...state.accountsByGroup, [groupId]: [] };

			localStorage.setItem('accountsByGroup', JSON.stringify(newState));
			return { accountsByGroup: newState };
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
			return { selectedGroup: group };
		}),
}));

export default useAccountStore;
