'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import useProxyStore from '@/store/proxyStore';

export default function ProxyModal({ open, handleClose }) {
    const { addProxies } = useProxyStore();
    const [proxyInput, setProxyInput] = useState('');

    // Function to parse proxies from textarea
    const handleSaveProxies = () => {
        const proxyLines = proxyInput
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0); // Remove empty lines

        addProxies(proxyLines); // Pass full proxy strings
        setProxyInput('');
        handleClose();
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
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSaveProxies} color="primary" variant="contained">+ Add Proxies</Button>
            </DialogActions>
        </Dialog>
    );
}
