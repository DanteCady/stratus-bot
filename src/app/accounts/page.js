'use client';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AccountSidebar from '@/components/accounts/accountSidebar';
import AccountControls from '@/components/accounts/accountControls';
import AccountTable from '@/components/accounts/accountTable';
import AccountModal from '@/components/accounts/accountModal';
import EditAccountModal from '@/components/accounts/accountEditModal';
import useAccountStore from '@/store/accountStore';

export default function Accounts() {
	const { selectedGroup, fetchAccountGroups } = useAccountStore();
	const [openModal, setOpenModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState(null);

	// Fetch account groups only once on mount
	useEffect(() => {
		const initializeData = async () => {
			await fetchAccountGroups();
		};
		initializeData();
	}, []); // Empty dependency array

	const handleCloseModal = () => setOpenModal(false);
	const handleCloseEditModal = () => setOpenEditModal(false);

	// ** Handle opening the edit modal and passing data **
	const handleEdit = (account) => {
		setAccountToEdit(account);
		setOpenEditModal(true);
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Account Groups */}
			<AccountSidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Dynamic Header with null check */}
				<Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
					Accounts {selectedGroup ? `(${selectedGroup.name})` : ''}
				</Typography>
				{/* Account Controls */}
				<AccountControls openModal={() => setOpenModal(true)} />
				{/* Accounts Table */}
				<AccountTable onEdit={handleEdit} /> {/* Pass handleEdit */}
				{/* Add Account Modal */}
				<AccountModal open={openModal} handleClose={handleCloseModal} />
				{/* Edit Account Modal */}
				<EditAccountModal
					open={openEditModal}
					handleClose={handleCloseEditModal}
					accountToEdit={accountToEdit}
				/>
			</Box>
		</Box>
	);
}
