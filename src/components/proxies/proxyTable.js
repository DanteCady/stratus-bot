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
		<TableContainer
			component={Paper}
			sx={{ mt: 2, maxHeight: '650px', overflowY: 'auto' }} // Makes the table scrollable
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
									<Tooltip title={proxy.fullProxy} arrow>
										<span>{truncateProxy(proxy.fullProxy)}</span>
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
	);
}
