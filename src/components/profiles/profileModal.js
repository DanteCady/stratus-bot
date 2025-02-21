'use client';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
	Typography,
	useTheme,
	Grid,
	Divider,
} from '@mui/material';
import useProfileStore from '@/store/profileStore';

export default function ProfileModal({ open, handleClose, profile }) {
	const theme = useTheme();
	const { addProfile, updateProfile } = useProfileStore();

	const [profileData, setProfileData] = useState({
		id: Date.now(),
		profileName: '',
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		address2: '',
		country: '',
		state: '',
		city: '',
		zipcode: '',
		cardholder: '',
		cardNumber: '',
		expMonth: '',
		expYear: '',
		cvv: '',
	});

	// Load profile data when editing
	useEffect(() => {
		if (profile) {
			setProfileData(profile);
		} else {
			setProfileData({ id: Date.now() }); // Reset for new profile
		}
	}, [profile]);

	const handleChange = (e) => {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	};

	const handleSaveProfile = () => {
		if (profile) {
			updateProfile(profileData);
		} else {
			addProfile(profileData);
		}
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.primary.main, fontWeight: 'bold', p: 2 }}>
				{profile ? 'Edit Profile' : 'Create Profile'}
			</DialogTitle>

			<DialogContent sx={{ backgroundColor: theme.palette.background.default, p: 3 }}>
				<Grid container spacing={3}>
					{/* Profile Information */}
					<Grid item xs={12} md={6}>
						<TextField label="Profile Name" name="profileName" value={profileData.profileName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="First Name" name="firstName" value={profileData.firstName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="Email" name="email" value={profileData.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="Phone" name="phone" value={profileData.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="Address" name="address" value={profileData.address} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
					</Grid>

					{/* Payment Information */}
					<Grid item xs={12} md={5}>
						<TextField label="Cardholder Name" name="cardholder" value={profileData.cardholder} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="Card Number" name="cardNumber" value={profileData.cardNumber} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<TextField label="CVV" name="cvv" value={profileData.cvv} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
					</Grid>
				</Grid>
			</DialogContent>

			{/* Buttons */}
			<DialogActions sx={{ backgroundColor: theme.palette.background.default, p: 2 }}>
				<Button onClick={handleClose} sx={{ color: theme.palette.primary.light }}>
					Cancel
				</Button>
				<Button onClick={handleSaveProfile} variant="contained" color="primary">
					{profile ? 'Save Changes' : '+ Add Profile'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
