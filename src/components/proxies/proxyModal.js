'use client';
import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';
import useProxyStore from '@/store/proxyStore';
import { useSnackbar } from '@/context/snackbar'; 

export default function ProxyModal({ open, handleClose }) {
	const { addProxies } = useProxyStore();
	const { showSnackbar } = useSnackbar();
	const [proxyInput, setProxyInput] = useState('');

	const handleSaveProxies = async () => {
		try {
			const proxyLines = proxyInput
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0);

			if (proxyLines.length === 0) {
				showSnackbar('Please enter at least one proxy', 'error');
				return;
			}

			await addProxies(proxyLines);
			showSnackbar('✅ Proxies added successfully', 'success');
			setProxyInput('');
			handleClose();
		} catch (error) {
			showSnackbar('❌ Error adding proxies', 'error');
			console.error('Error adding proxies:', error);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add Proxies</DialogTitle>
			<DialogContent>
				<TextField
					label="Proxy List"
					multiline
					rows={10}
					fullWidth
					value={proxyInput}
					onChange={(e) => setProxyInput(e.target.value)}
					placeholder="Enter proxies in format: ip:port:user:pass OR ip:port"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSaveProxies} color="primary" variant="contained">
					+ Add Proxies
				</Button>
			</DialogActions>
		</Dialog>
	);
}
