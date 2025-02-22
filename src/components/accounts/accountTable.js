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
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';
import useAccountStore from '@/store/accountStore';

export default function AccountTable({ onEdit }) {
	const { accountsByGroup, selectedGroup, deleteAccount } = useAccountStore();
	const [selectedAccounts, setSelectedAccounts] = useState([]);

	const accounts = accountsByGroup[selectedGroup.id] || []; // Get accounts for selected group

	// Toggle selection
	const handleSelect = (id) => {
		setSelectedAccounts((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	// Select all accounts
	const handleSelectAll = () => {
		setSelectedAccounts(
			selectedAccounts.length === accounts.length ? [] : accounts.map((account) => account.id)
		);
	};

	return (
		<TableContainer component={Paper} sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								checked={selectedAccounts.length === accounts.length && accounts.length > 0}
								onChange={handleSelectAll}
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
							<TableRow key={account.id} selected={selectedAccounts.includes(account.id)}>
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedAccounts.includes(account.id)}
										onChange={() => handleSelect(account.id)}
									/>
								</TableCell>
								<TableCell>{account.site}</TableCell>
								<TableCell>{account.username}</TableCell>
								<TableCell>******</TableCell> {/* Hide password */}
								<TableCell>{account.proxy || 'N/A'}</TableCell>
								<TableCell>{account.status || 'Unknown'}</TableCell>
								<TableCell>
									<Tooltip title="Login">
										<IconButton color="success">
											<PlayArrowIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Edit">
										<IconButton onClick={() => onEdit(account)} color="primary">
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete">
										<IconButton onClick={() => deleteAccount(account.id)} color="error">
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
	);
}
