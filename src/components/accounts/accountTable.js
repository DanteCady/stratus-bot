'use client';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Checkbox, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';
import useAccountStore from '@/store/accountStore';

export default function AccountTable() {
    const { accountsByGroup, selectedGroup, deleteAccount } = useAccountStore();
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    const accounts = accountsByGroup[selectedGroup.id] || [];

    // Function to truncate long strings
    const truncateString = (str) => str.length > 30 ? `${str.slice(0, 30)}...` : str;

    // Placeholder function for logging into the account
    const handleLogin = (account) => {
        console.log(`Logging into ${account.username} on ${account.site} using proxy: ${account.proxy}`);
        // Future: Trigger a bot or automation process here
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox />
                        </TableCell>
                        <TableCell>Site</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell>Proxy</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.length > 0 ? (
                        accounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{account.site}</TableCell>
                                <TableCell>
                                    <Tooltip title={account.username} arrow>
                                        <span>{truncateString(account.username)}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>******</TableCell>
                                <TableCell>
                                    <Tooltip title={account.proxy} arrow>
                                        <span>{truncateString(account.proxy)}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{account.status}</TableCell>
                                <TableCell>
                                    <Tooltip title="Login to Account" arrow>
                                        <IconButton onClick={() => handleLogin(account)} color="primary">
                                            <PlayArrowIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Account" arrow>
                                        <IconButton onClick={() => deleteAccount(account.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No accounts found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
