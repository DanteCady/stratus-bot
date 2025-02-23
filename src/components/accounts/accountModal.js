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

export default function AddAccountModal({ open, handleClose }) {
    const { addAccounts, selectedGroup } = useAccountStore();
    const [accountInput, setAccountInput] = useState('');
    const [selectedSite, setSelectedSite] = useState('');

    // Predefined site options
    const siteOptions = ['Nike', 'Footlocker', 'Adidas', 'SNKRS'];

    // Ensure valid formatting and parsing
    const handleSaveAccounts = () => {
        if (!selectedSite) {
            alert('Please select a site!');
            return;
        }

        const accountLines = accountInput
            .trim()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0); // Remove empty lines

        if (accountLines.length === 0) {
            alert('No valid accounts entered!');
            return;
        }

        const parsedAccounts = accountLines.map((line) => {
            const parts = line.split(':::');
            if (parts.length < 2) return null; // Ensure username and password exist

            return {
                id: Date.now() + Math.random(),
                site: selectedSite,
                username: parts[0] || '',
                password: parts[1] || '',
                proxy: parts.length > 2 ? parts[2] : 'N/A',
                status: 'Unchecked',
            };
        }).filter(Boolean); // Remove invalid entries

        if (parsedAccounts.length === 0) {
            alert('Invalid format! Use: username:::password:::proxy (proxy optional)');
            return;
        }

        // Ensure `parsedAccounts` is an array before passing
        addAccounts(selectedGroup.id, parsedAccounts);

        // Clear input and close modal
        setAccountInput('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Accounts</DialogTitle>
            <DialogContent>
                {/* Site Selection Dropdown */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select a Site</InputLabel>
                    <Select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        label="Select a Site"
                    >
                        {siteOptions.map((site) => (
                            <MenuItem key={site} value={site}>
                                {site}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Account Input Field */}
                <TextField
                    label="Account List"
                    multiline
                    rows={10}
                    fullWidth
                    value={accountInput}
                    onChange={(e) => setAccountInput(e.target.value)}
                    placeholder="Enter accounts in format: username:::password:::proxy (proxy optional)"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSaveAccounts} color="primary" variant="contained">
                    Add Accounts
                </Button>
            </DialogActions>
        </Dialog>
    );
}
