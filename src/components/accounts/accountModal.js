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

export default function AccountModal({ open, handleClose, accountToEdit }) {
    const { updateAccount, addAccounts } = useAccountStore();
    const [accountData, setAccountData] = useState({
        site: '',
        username: '',
        password: '',
        proxy: '',
    });

    // Load account data when editing
    useEffect(() => {
        if (accountToEdit) {
            setAccountData(accountToEdit);
        } else {
            setAccountData({ site: '', username: '', password: '', proxy: '' });
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

        if (accountToEdit) {
            updateAccount(accountData);
        } else {
            addAccounts([`${accountData.site}:::${accountData.username}:::${accountData.password}:::${accountData.proxy}`]);
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{accountToEdit ? 'Edit Account' : 'Add Account'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Site"
                    fullWidth
                    name="site"
                    value={accountData.site}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
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
                    {accountToEdit ? 'Save' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
