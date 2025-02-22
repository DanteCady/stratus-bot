'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import AccountSidebar from '@/components/accounts/accountSidebar';
import AccountControls from '@/components/accounts/accountControls';
import AccountTable from '@/components/accounts/accountTable';
import AccountModal from '@/components/accounts/accountModal';
import EditAccountModal from '@/components/accounts/accountEditModal'; 
import useAccountStore from '@/store/accountStore';

export default function Accounts() {
	const { addAccount } = useAccountStore();
	const [openModal, setOpenModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState(null);

	// Open Edit Modal with Data
	const handleEditAccount = (account) => {
		setAccountToEdit(account);
		setOpenEditModal(true);
	};

	const handleCloseModal = () => setOpenModal(false);
	const handleCloseEditModal = () => {
		setAccountToEdit(null);
		setOpenEditModal(false);
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Account Groups */}
			<AccountSidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Account Controls */}
				<AccountControls openModal={() => setOpenModal(true)} />

				{/* Accounts Table */}
				<AccountTable onEdit={handleEditAccount} />

				{/* Add Account Modal */}
				<AccountModal open={openModal} handleClose={handleCloseModal} addAccount={addAccount} />

				{/* Edit Account Modal */}
				<EditAccountModal open={openEditModal} handleClose={handleCloseEditModal} accountToEdit={accountToEdit} />
			</Box>
		</Box>
	);
}
