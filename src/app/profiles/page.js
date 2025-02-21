'use client';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProfileSidebar from '@/components/profiles/profileSidebar';
import ProfileModal from '@/components/profiles/profileModal';
import ProfileControls from '@/components/profiles/profileControls';
import useProfileStore from '@/store/profileStore';
import GlobalTable from '@/components/global/globalTable';

export default function Profiles() {
	const { profiles, loadProfiles, deleteProfile } = useProfileStore();
	const [openModal, setOpenModal] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);

	// Load profiles from localStorage on mount
	useEffect(() => {
		loadProfiles();
	}, []);

	const handleEdit = (profile) => {
		setSelectedProfile(profile); // Ensure correct data is passed to modal
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setSelectedProfile(null); // Reset profile selection on close
		setOpenModal(false);
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Profile Groups */}
			<ProfileSidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Profile Controls */}
				<ProfileControls openModal={() => setOpenModal(true)} />

				{/* Profiles Table */}
				<GlobalTable
					headers={['Profile Name', 'Email', 'Address', 'Card']}
					data={profiles.map((profile) => ({
						...profile,
						card: profile.cardNumber ? `**** ${profile.cardNumber.slice(-4)}` : '****',
					}))}
					selectable={true}
					actions={true}
					onEdit={handleEdit}
					onDelete={deleteProfile}
				/>

				{/* Profile Modal */}
				<ProfileModal open={openModal} handleClose={handleCloseModal} profile={selectedProfile} />
			</Box>
		</Box>
	);
}
