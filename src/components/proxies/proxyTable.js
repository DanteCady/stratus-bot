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
    Box,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import useProxyStore from '@/store/proxyStore';

export default function ProxyTable() {
    const { proxies, deleteProxy } = useProxyStore();
    const [selectedProxies, setSelectedProxies] = useState([]);

    // Function to truncate long proxy strings
    const truncateProxy = (proxy) => {
        if (!proxy) return 'N/A';
        return proxy.length > 30 ? `${proxy.slice(0, 30)}...` : proxy;
    };

    // Toggle selection
    const handleSelect = (id) => {
        setSelectedProxies((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    // Select all proxies
    const handleSelectAll = () => {
        setSelectedProxies(
            selectedProxies.length === proxies.length
                ? []
                : proxies.map((proxy) => proxy.id)
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '650px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: (theme) => theme.palette.background.paper,
            }}
        >
            {/* Table Header - Stays Fixed */}
            <Box
                sx={{
                    // backgroundColor: (theme) => theme.palette.primary.main,
                    // color: (theme) => theme.palette.primary.contrastText,
                    padding: '10px',
                    fontWeight: 'bold',
                }}
            >
                <Typography variant="h6">Proxy List</Typography>
            </Box>

            {/* Scrollable Table Container */}
            <TableContainer
                component={Paper}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    maxHeight: '100%',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={
                                        selectedProxies.length === proxies.length &&
                                        proxies.length > 0
                                    }
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Proxy</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proxies.length > 0 ? (
                            proxies.map((proxy) => (
                                <TableRow
                                    key={proxy.id}
                                    selected={selectedProxies.includes(proxy.id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedProxies.includes(proxy.id)}
                                            onChange={() => handleSelect(proxy.id)}
                                        />
                                    </TableCell>

                                    {/* Show truncated proxy with tooltip for full proxy */}
                                    <TableCell>
                                        <Tooltip title={proxy.address} arrow>
                                            <span>{truncateProxy(proxy.address)}</span>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell>{proxy.status || 'Untested'}</TableCell>

                                    <TableCell>
                                        <IconButton
                                            onClick={() => deleteProxy(proxy.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No proxies found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Table Footer - Stays Fixed */}
            <Box
                sx={{
                    backgroundColor: (theme) => theme.palette.background.default,
                    padding: '10px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                Total Proxies: {proxies.length}
            </Box>
        </Box>
    );
}
