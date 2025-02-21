'use client';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme } from '@mui/material';

export default function ConfirmationModal({ open, handleClose, handleConfirm, title, message }) {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    p: 2,
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleConfirm} variant="contained" color="error">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
