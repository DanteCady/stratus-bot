'use client';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProfileSidebar from '@/components/profiles/profileSidebar';
import ProfileModal from '@/components/profiles/profileModal';
import ProfileControls from '@/components/profiles/profileControls';
import useProfileStore from '@/store/profileStore';
import GlobalTable from '@/components/global/globalTable';
import { useSnackbar } from '@/context/snackbar';

export default function Profiles() {
	const { 
		profiles, 
		selectedProfileGroup, 
		fetchProfiles, 
		deleteProfile 
	} = useProfileStore();
	const { showSnackbar } = useSnackbar();

	const [openModal, setOpenModal] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);

	// Load profiles for the selected group
	useEffect(() => {
		if (selectedProfileGroup) {
			fetchProfiles(selectedProfileGroup.id);
		}
	}, [selectedProfileGroup, fetchProfiles]);

	const handleEdit = (profile) => {
		setSelectedProfile(profile); // Ensure correct data is passed to modal
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setSelectedProfile(null); // Reset profile selection on close
		setOpenModal(false);
	};

	const handleDelete = async (profileId) => {
		try {
			await deleteProfile(profileId, selectedProfileGroup.id);
			showSnackbar('✅ Profile deleted successfully', 'success');
		} catch (error) {
			showSnackbar('❌ Error deleting profile', 'error');
			console.error('Error deleting profile:', error);
		}
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Profile Groups */}
			<ProfileSidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Profile Controls */}
				<ProfileControls openModal={() => setOpenModal(true)} />

				{/* Profiles Table (Filtered by Selected Group) */}
				<GlobalTable
					headers={['Profile Name', 'Email', 'Address', 'Card']}
					data={profiles.map((profile) => ({
						...profile,
						card: profile.cardNumber ? `**** ${profile.cardNumber.slice(-4)}` : '****',
					}))}
					selectable={true}
					actions={true}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>

				{/* Profile Modal */}
				<ProfileModal open={openModal} handleClose={handleCloseModal} profile={selectedProfile} />
			</Box>
		</Box>
	);
}
