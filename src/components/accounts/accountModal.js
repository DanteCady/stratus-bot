'use client';
import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from '@mui/material';
import useAccountStore from '@/store/accountStore';
import { useSnackbar } from '@/context/snackbar';

export default function AddAccountModal({ open, handleClose }) {
	const { addAccount, selectedGroup } = useAccountStore();
	const { showSnackbar } = useSnackbar();
	const [accountInput, setAccountInput] = useState('');
	const [selectedSite, setSelectedSite] = useState('');

	// Predefined site options
	const siteOptions = ['Nike', 'Footlocker', 'Adidas', 'SNKRS'];

	const handleSaveAccounts = async () => {
		if (!selectedSite) {
			showSnackbar('Please select a site!', 'error');
			return;
		}

		const accountLines = accountInput
			.trim()
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (accountLines.length === 0) {
			showSnackbar('No valid accounts entered!', 'error');
			return;
		}

		let successCount = 0;
		let failCount = 0;

		// Process each account line
		for (const line of accountLines) {
			const parts = line.split(':::');
			if (parts.length < 2) {
				showSnackbar(
					'Invalid format! Use: email:::password:::proxy (proxy optional)',
					'error'
				);
				return;
			}

			const accountData = {
				site: selectedSite,
				email: parts[0],
				password: parts[1],
				proxy: parts[2] || null,
				status: 'pending',
			};

			try {
				await addAccount(accountData);
				successCount++;
			} catch (error) {
				console.error('Error adding account:', error);
				failCount++;
			}
		}

		// Show summary message
		if (successCount > 0) {
			showSnackbar(
				`✅ Successfully added ${successCount} account${
					successCount > 1 ? 's' : ''
				}` + (failCount > 0 ? ` (${failCount} failed)` : ''),
				failCount > 0 ? 'warning' : 'success'
			);
		} else {
			showSnackbar('❌ Failed to add accounts', 'error');
		}

		setAccountInput('');
		setSelectedSite('');
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add Accounts</DialogTitle>
			<DialogContent>
				<FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
					<InputLabel>Site</InputLabel>
					<Select
						value={selectedSite}
						label="Site"
						onChange={(e) => setSelectedSite(e.target.value)}
					>
						{siteOptions.map((site) => (
							<MenuItem key={site} value={site}>
								{site}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					fullWidth
					multiline
					rows={10}
					value={accountInput}
					onChange={(e) => setAccountInput(e.target.value)}
					placeholder="Enter accounts in format: email:::password:::proxy"
					variant="outlined"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Cancel
				</Button>
				<Button
					onClick={handleSaveAccounts}
					color="primary"
					variant="contained"
				>
					Add Accounts
				</Button>
			</DialogActions>
		</Dialog>
	);
}
