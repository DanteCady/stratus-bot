'use client';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AccountSidebar from '@/components/accounts/accountSidebar';
import AccountControls from '@/components/accounts/accountControls';
import AccountTable from '@/components/accounts/accountTable';
import AccountModal from '@/components/accounts/accountModal';
import useAccountStore from '@/store/accountStore';

export default function Accounts() {
	const { selectedGroup } = useAccountStore();
	const [openModal, setOpenModal] = useState(false);

	const handleCloseModal = () => setOpenModal(false);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Account Groups */}
			<AccountSidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Account Group Title */}
				<Typography variant="h5" sx={{ mb: 2 }}>
					Accounts ({selectedGroup.name})
				</Typography>

				{/* Account Controls */}
				<AccountControls openModal={() => setOpenModal(true)} />

				{/* Accounts Table */}
				<AccountTable />

				{/* Account Modal */}
				<AccountModal open={openModal} handleClose={handleCloseModal} />
			</Box>
		</Box>
	);
}
