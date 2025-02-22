'use client';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import useAccountStore from '@/store/accountStore';

export default function EditAccountModal({ open, handleClose, accountToEdit }) {
    const { editAccountById, deleteAccount } = useAccountStore();
    const [accountData, setAccountData] = useState({
        username: '',
        password: '',
        proxy: '',
    });

    // Populate fields when editing
    useEffect(() => {
        if (accountToEdit) {
            setAccountData(accountToEdit);
        }
    }, [accountToEdit]);

    // Handle input changes
    const handleChange = (e) => {
        setAccountData({ ...accountData, [e.target.name]: e.target.value });
    };

    // Handle save
    const handleSave = () => {
        if (!accountData.username || !accountData.password) {
            alert('Username and Password are required!');
            return;
        }

        editAccountById(accountData);
        handleClose();
    };

    // Handle delete account
    const handleDeleteAccount = () => {
        deleteAccount(accountData.id);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    fullWidth
                    name="username"
                    value={accountData.username}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    name="password"
                    value={accountData.password}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Proxy (Optional)"
                    fullWidth
                    name="proxy"
                    value={accountData.proxy}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
