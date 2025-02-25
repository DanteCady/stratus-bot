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
	Typography,
	Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import useProxyStore from '@/store/proxyStore';

export default function ProxyTable() {
	const { proxiesByGroup, selectedGroup, deleteProxy } = useProxyStore();
	const [selectedProxies, setSelectedProxies] = useState([]);

	const proxies = proxiesByGroup[selectedGroup.id] || []; // Get proxies for selected group

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
			selectedProxies.length === proxies.length ? [] : proxies.map((proxy) => proxy.id)
		);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Table Container with Sticky Header & Scrollable Body */}
			<TableContainer
				component={Paper}
				sx={{ flexGrow: 1, maxHeight: '600px', overflowY: 'auto' }}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									checked={selectedProxies.length === proxies.length && proxies.length > 0}
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
								<TableRow key={proxy.id} selected={selectedProxies.includes(proxy.id)}>
									<TableCell padding="checkbox">
										<Checkbox
											checked={selectedProxies.includes(proxy.id)}
											onChange={() => handleSelect(proxy.id)}
										/>
									</TableCell>
									<TableCell>
										<Tooltip title={proxy.address} arrow>
											<span>{truncateProxy(proxy.address)}</span>
										</Tooltip>
									</TableCell>
									<TableCell>{proxy.status || 'Untested'}</TableCell>
									<TableCell>
										<IconButton onClick={() => deleteProxy(proxy.id)} color="error">
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

			{/* Footer with Total Count - Always Visible */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					padding: '10px',
					backgroundColor: 'background.paper',
					borderTop: '1px solid rgba(224, 224, 224, 1)',
				}}
			>
				<Typography variant="body1" fontWeight="bold">
					Total Proxies: {proxies.length}
				</Typography>
			</Box>
		</Box>
	);
}
