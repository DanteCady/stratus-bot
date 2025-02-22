'use client';
import { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import useAccountStore from '@/store/accountStore';

export default function AccountModal({ open, handleClose }) {
    const { addAccounts } = useAccountStore();
    const [selectedSite, setSelectedSite] = useState('');
    const [accountInput, setAccountInput] = useState('');

    const supportedSites = ['Nike', 'Adidas', 'SNKRS', 'Shopify', 'Supreme']; // List of sites

    // Function to parse accounts from textarea
    const handleSaveAccounts = () => {
        if (!selectedSite || accountInput.trim() === '') return;

        const accountLines = accountInput
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0); // Remove empty lines

        const parsedAccounts = accountLines.map(line => {
            const parts = line.split(':::'); // Format: email:::password:::proxy (optional)
            return {
                id: Date.now() + Math.random(),
                site: selectedSite,
                username: parts[0] || '',
                password: parts[1] || '',
                proxy: parts[2] || 'N/A',
                status: 'Unchecked',
            };
        });

        addAccounts(parsedAccounts);
        setAccountInput('');
        setSelectedSite('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Accounts</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select a Site</InputLabel>
                    <Select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        label="Select a Site"
                    >
                        {supportedSites.map((site) => (
                            <MenuItem key={site} value={site}>
                                {site}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Account List"
                    multiline
                    rows={10}
                    fullWidth
                    value={accountInput}
                    onChange={(e) => setAccountInput(e.target.value)}
                    placeholder="Format: Email:::Password:::Proxy (optional)"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSaveAccounts} color="primary" variant="contained">+ Add Accounts</Button>
            </DialogActions>
        </Dialog>
    );
}
