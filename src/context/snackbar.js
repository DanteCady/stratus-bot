import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'info',
	});

	// Function to show snackbar
	const showSnackbar = useCallback((message, severity = 'info') => {
		setSnackbar({ open: true, message, severity });
	}, []);

	// Function to close snackbar
	const handleClose = (_, reason) => {
		if (reason === 'clickaway') return;
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
}

export function useSnackbar() {
	return useContext(SnackbarContext);
}
