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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import useAccountStore from '@/store/accountStore';
import { useState } from 'react';

export default function AccountTable({ onEdit }) {
	const { accountsByGroup, selectedGroup, deleteAccount } = useAccountStore();
	const accounts = accountsByGroup[selectedGroup.id] || []; // Get accounts for selected group
	const [selectedAccounts, setSelectedAccounts] = useState([]);

	// Toggle selection
	const handleSelect = (id) => {
		setSelectedAccounts((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	// Truncate proxy for display
	const truncateProxy = (proxy) => (proxy && proxy.length > 30 ? `${proxy.slice(0, 30)}...` : proxy || 'N/A');

	return (
		<Paper sx={{ mt: 2, overflow: 'hidden' }}>
			{/* Scrollable Table Container */}
			<TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									checked={selectedAccounts.length === accounts.length && accounts.length > 0}
									onChange={() =>
										setSelectedAccounts(
											selectedAccounts.length === accounts.length ? [] : accounts.map((acc) => acc.id)
										)
									}
								/>
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
										<Checkbox
											checked={selectedAccounts.includes(account.id)}
											onChange={() => handleSelect(account.id)}
										/>
									</TableCell>
									<TableCell>{account.site}</TableCell>
									<TableCell>{account.username}</TableCell>
									<TableCell>******</TableCell>
									<TableCell>
										<Tooltip title={account.proxy} arrow>
											<span>{truncateProxy(account.proxy)}</span>
										</Tooltip>
									</TableCell>
									<TableCell>{account.status}</TableCell>
									<TableCell>
										<Tooltip title="Login">
											<IconButton color="success">
												<PlayArrowIcon />
											</IconButton>
										</Tooltip>
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
								<TableCell colSpan={7} align="center">
									No accounts found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Footer showing total accounts */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'background.default' }}>
				<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
					Total Accounts: {accounts.length}
				</Typography>
			</Box>
		</Paper>
	);
}
