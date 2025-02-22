import { create } from 'zustand';

const useAccountStore = create((set) => ({
    accountGroups: JSON.parse(localStorage.getItem('accountGroups')) || [{ id: 1, name: "Default Group" }],
    selectedGroup: JSON.parse(localStorage.getItem('selectedAccountGroup')) || { id: 1, name: "Default Group" },
    accountsByGroup: JSON.parse(localStorage.getItem('accountsByGroup')) || { 1: [] }, // Store accounts per group

    // ** Add Accounts to Selected Group **
    addAccounts: (accounts) =>
        set((state) => {
            const groupId = state.selectedGroup.id;
            const updatedAccounts = {
                ...state.accountsByGroup,
                [groupId]: [...(state.accountsByGroup[groupId] || []), ...accounts]
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
            return { selectedGroup: group };
        }),

    // ** Delete All Accounts in Selected Group **
    deleteAllAccounts: () =>
        set((state) => {
            const groupId = state.selectedGroup.id;
            const updatedAccounts = { ...state.accountsByGroup, [groupId]: [] };
            localStorage.setItem('accountsByGroup', JSON.stringify(updatedAccounts));
            return { accountsByGroup: updatedAccounts };
        }),
}));

export default useAccountStore;
