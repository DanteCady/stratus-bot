'use client';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';

export default function DynamicModal({ open, handleClose, saveTask }) {
	const [site, setSite] = useState('');

	useEffect(() => {
	}, [open]);

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create Tasks</DialogTitle>
			<DialogContent>
				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Select a Site</InputLabel>
					<Select value={site} onChange={(e) => setSite(e.target.value)}>
						<MenuItem value="Nike">Nike</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={() => saveTask({ id: Date.now(), site })} color="primary" variant="contained" disabled={!site}>
					+ Add Task
				</Button>
			</DialogActions>
		</Dialog>
	);
}
