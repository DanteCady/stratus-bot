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

// Function to get last 4 digits of card number
const maskCardNumber = (cardNumber) => {
	if (!cardNumber) return '****';
	const lastFour = cardNumber.slice(-4);
	return `**** ${lastFour}`;
};

export default function ProfileModal({ open, handleClose, profile }) {
	const theme = useTheme();
	const { addProfile, updateProfile } = useProfileStore();

	const [profileData, setProfileData] = useState({
		id: profile?.id || Date.now(),
		profileName: profile?.profileName || '',
		firstName: profile?.firstName || '',
		lastName: profile?.lastName || '',
		email: profile?.email || '',
		phone: profile?.phone || '',
		address: profile?.address || '',
		address2: profile?.address2 || '',
		country: profile?.country || '',
		state: profile?.state || '',
		city: profile?.city || '',
		zipcode: profile?.zipcode || '',
		cardholder: profile?.cardholder || '',
		cardNumber: profile?.cardNumber || '',
		expMonth: profile?.expMonth || '',
		expYear: profile?.expYear || '',
		cvv: profile?.cvv || '',
	});

	useEffect(() => {
		if (profile) {
			setProfileData({ ...profile });
		} else {
			setProfileData((prev) => ({ ...prev, id: Date.now() }));
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
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.default,
					color: theme.palette.primary.main,
					fontWeight: 'bold',
					p: 2,
				}}
			>
				{profile ? 'Edit Profile' : 'Create Profile'}
			</DialogTitle>

			<DialogContent sx={{ backgroundColor: theme.palette.background.default, p: 3 }}>
				<Grid container spacing={3}>
					{/* Left Side - Profile Info */}
					<Grid item xs={12} md={6}>
						<Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
							Profile Information
						</Typography>
						<TextField label="Profile Name" name="profileName" value={profileData.profileName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<TextField label="First Name" name="firstName" value={profileData.firstName} onChange={handleChange} fullWidth />
							</Grid>
							<Grid item xs={6}>
								<TextField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleChange} fullWidth />
							</Grid>
						</Grid>
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={6}>
								<TextField label="Email" name="email" value={profileData.email} onChange={handleChange} fullWidth />
							</Grid>
							<Grid item xs={6}>
								<TextField label="Phone" name="phone" value={profileData.phone} onChange={handleChange} fullWidth />
							</Grid>
						</Grid>
						<TextField label="Address" name="address" value={profileData.address} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
						<TextField label="Address 2 (Apt, Suite, etc.)" name="address2" value={profileData.address2} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>Country</InputLabel>
									<Select name="country" value={profileData.country} onChange={handleChange}>
										<MenuItem value="USA">USA</MenuItem>
										<MenuItem value="Canada">Canada</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>State</InputLabel>
									<Select name="state" value={profileData.state} onChange={handleChange}>
										<MenuItem value="CA">California</MenuItem>
										<MenuItem value="NY">New York</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={6}>
								<TextField label="City" name="city" value={profileData.city} onChange={handleChange} fullWidth />
							</Grid>
							<Grid item xs={6}>
								<TextField label="Zipcode" name="zipcode" value={profileData.zipcode} onChange={handleChange} fullWidth />
							</Grid>
						</Grid>
					</Grid>

					{/* Divider */}
					<Grid item xs={12} md={1}>
						<Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
					</Grid>

					{/* Right Side - Payment Info */}
					<Grid item xs={12} md={5}>
						<Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
							Payment Information
						</Typography>
						<Box
							sx={{
								backgroundColor: theme.palette.grey[900],
								p: 2,
								borderRadius: 2,
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
							}}
						>
							<Typography sx={{ color: theme.palette.grey[400], fontSize: '0.85rem' }}>
								💳 {maskCardNumber(profileData.cardNumber)}
							</Typography>
							<Typography sx={{ color: theme.palette.grey[500], fontSize: '0.75rem' }}>
								MM / YYYY CVV
							</Typography>
						</Box>
						<TextField label="Cardholder Name" name="cardholder" value={profileData.cardholder} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
						<TextField label="Card Number" name="cardNumber" value={profileData.cardNumber} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>Exp. Month</InputLabel>
									<Select name="expMonth" value={profileData.expMonth} onChange={handleChange}>
										<MenuItem value="01">January</MenuItem>
										<MenuItem value="02">February</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>Exp. Year</InputLabel>
									<Select name="expYear" value={profileData.expYear} onChange={handleChange}>
										<MenuItem value="2024">2024</MenuItem>
										<MenuItem value="2025">2025</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>

			{/* Buttons */}
			<DialogActions sx={{ backgroundColor: theme.palette.background.default, p: 2 }}>
				<Button onClick={handleClose} sx={{ color: theme.palette.primary.light }}>
					Cancel
				</Button>
				<Button onClick={handleSaveProfile} variant="contained" color="primary">
					+ Add Profile
				</Button>
			</DialogActions>
		</Dialog>
	);
}
