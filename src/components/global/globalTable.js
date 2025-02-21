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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useProfileStore from '@/store/profileStore';

// Function to determine card brand (VISA, MASTERCARD, AMEX)
const getCardBrand = (cardNumber) => {
	if (!cardNumber) return '';

	const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
	const mastercardRegex = /^5[1-5][0-9]{14}$|^2[2-7][0-9]{14}$/;
	const amexRegex = /^3[47][0-9]{13}$/;

	if (visaRegex.test(cardNumber)) return 'VISA';
	if (mastercardRegex.test(cardNumber)) return 'MASTERCARD';
	if (amexRegex.test(cardNumber)) return 'AMEX';

	return 'UNKNOWN';
};

export default function GlobalTable({
	headers,
	data,
	selectable,
	actions,
	onEdit,
	onDelete,
	onStart,
}) {
	const [selectedRows, setSelectedRows] = useState([]);
	const { duplicateProfile } = useProfileStore();

	// Toggle selection
	const handleSelect = (id) => {
		setSelectedRows((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	// Select all rows
	const handleSelectAll = () => {
		setSelectedRows(
			selectedRows.length === data.length ? [] : data.map((row) => row.id)
		);
	};

	return (
		<TableContainer component={Paper} sx={{ mt: 2 }}>
			<Table>
				<TableHead>
					<TableRow>
						{selectable && (
							<TableCell padding="checkbox">
								<Checkbox
									checked={
										selectedRows.length === data.length && data.length > 0
									}
									onChange={handleSelectAll}
								/>
							</TableCell>
						)}
						{headers.map((header, index) => (
							<TableCell key={index}>{header}</TableCell>
						))}
						{actions && <TableCell>Actions</TableCell>}
					</TableRow>
				</TableHead>

				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id} selected={selectedRows.includes(row.id)}>
							{selectable && (
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedRows.includes(row.id)}
										onChange={() => handleSelect(row.id)}
									/>
								</TableCell>
							)}

							{/* Profile Name */}
							<TableCell>{row.profileName || 'Unnamed Profile'}</TableCell>

							{/* Email */}
							<TableCell>{row.email}</TableCell>

							{/* Address */}
							<TableCell>{row.address}</TableCell>

							{/* Card Display (Brand in Bold + Last 4 Digits) */}
							<TableCell>
								{row.cardNumber ? (
									<>
										<strong>{getCardBrand(row.cardNumber)}</strong> ****{' '}
										{row.cardNumber.slice(-4)}
									</>
								) : (
									'No Card'
								)}
							</TableCell>

							{actions && (
								<TableCell>
									{onStart && (
										<Tooltip title="Start">
											<IconButton onClick={() => onStart(row.id)} color="primary">
												<PlayArrowIcon />
											</IconButton>
										</Tooltip>
									)}
									<Tooltip title="Edit">
										<IconButton onClick={() => onEdit(row)} color="secondary">
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete">
										<IconButton onClick={() => onDelete(row.id)} color="error">
											<DeleteIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Duplicate Profile">
										<IconButton onClick={() => duplicateProfile(row.id)} color="primary">
											<ContentCopyIcon />
										</IconButton>
									</Tooltip>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
