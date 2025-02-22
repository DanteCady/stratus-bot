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
    Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useProxyStore from '@/store/proxyStore';

export default function ProxyTable() {
    const { proxies, deleteProxy } = useProxyStore();

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Proxy</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proxies.map((proxy) => (
                        <TableRow key={proxy.id}>
                            <TableCell>{proxy.address}</TableCell>
                            <TableCell>{proxy.status || "Unknown"}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => deleteProxy(proxy.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
