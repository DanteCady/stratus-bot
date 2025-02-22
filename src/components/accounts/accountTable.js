'use client';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Checkbox,
	Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import useAccountStore from '@/store/accountStore';
import { useState } from 'react';

export default function AccountTable({ onEdit }) {
    const { accountsByGroup, selectedGroup, deleteAccount } = useAccountStore();
    const accounts = accountsByGroup[selectedGroup.id] || []; // Get accounts for selected group

    return (
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
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
                                <TableCell>{account.site}</TableCell>
                                <TableCell>{account.username}</TableCell>
                                <TableCell>******</TableCell>
                                <TableCell>
                                    {account.proxy ? account.proxy.slice(0, 20) + '...' : 'N/A'}
                                </TableCell>
                                <TableCell>{account.status}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton color="primary" onClick={() => onEdit(account)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => deleteAccount(account.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No accounts found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
