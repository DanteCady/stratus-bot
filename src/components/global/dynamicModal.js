'use client';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
	Typography,
	IconButton,
	useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDropdownData } from '@/context/dropdownData';
import { useSnackbar } from '@/context/snackbar';
import useTaskStore from '@/store/taskStore'; // Import Task Store for selected group

export default function DynamicModal({
	open,
	handleClose,
	saveTask,
	editingTask,
}) {
	const theme = useTheme();
	const { dropdownData, loading } = useDropdownData();
	const { showSnackbar } = useSnackbar();
	const { selectedTaskGroup } = useTaskStore(); // Get selected task group

	const [site, setSite] = useState('');
	const [product, setProduct] = useState('');
	const [mode, setMode] = useState('');
	const [proxyList, setProxyList] = useState('');
	const [profile, setProfile] = useState('');
	const [monitorDelay, setMonitorDelay] = useState(3500);
	const [errorDelay, setErrorDelay] = useState(3500);
	const [taskAmount, setTaskAmount] = useState(1);
	const [isSaving, setIsSaving] = useState(false);
	const [showFields, setShowFields] = useState(false);

	// Load editing task data
	useEffect(() => {
		if (editingTask) {
			setSite(editingTask.site);
			setProduct(editingTask.product);
			setMode(editingTask.mode);
			setProxyList(editingTask.proxy);
			setProfile(editingTask.profile);
			setMonitorDelay(editingTask.monitorDelay);
			setErrorDelay(editingTask.errorDelay);
			setTaskAmount(editingTask.taskAmount);
			setShowFields(true);
		} else if (!open) {
			// Reset form when modal is closed
			setSite('');
			setProduct('');
			setMode('');
			setProxyList('');
			setProfile('');
			setMonitorDelay(3500);
			setErrorDelay(3500);
			setTaskAmount(1);
			setShowFields(false);
		}
	}, [open, editingTask]);

	// Handle site selection
	const handleSiteSelection = (value) => {
		setSite(value);
		setShowFields(true);
	};

	// Save task
	const handleSaveTask = async () => {
		if (!site || !product || !mode || taskAmount < 1) {
			showSnackbar('Please fill in all required fields.', 'error');
			return;
		}

		if (!dropdownData?.sites) {
			showSnackbar('Dropdown data not available. Try again later.', 'error');
			console.error('Dropdown data missing:', dropdownData);
			return;
		}

		const selectedSite = dropdownData.sites.find((s) => s.name === site);
		if (!selectedSite) {
			showSnackbar('Selected site not found.', 'error');
			console.error(
				'Error: Selected site not found in dropdownData.sites',
				dropdownData
			);
			return;
		}

		try {
			// Find the mode ID from the dropdownData
			const selectedMode = dropdownData.modes.find((m) => m.name === mode);
			if (!selectedMode) {
				showSnackbar('Invalid mode selected.', 'error');
				return;
			}

			const taskData = {
				task_group_id: selectedTaskGroup.id,
				product: product,
				monitor_delay: parseInt(monitorDelay),
				error_delay: parseInt(errorDelay),
				mode_id: selectedMode.id, // Keep as string (varchar in DB)
				status: 'pending', // Use valid enum value
				site_id: selectedSite?.id || null, // Add site_id
				proxy_id: proxyList || null, // Add proxy_id
			};

			console.log('📤 Sending Task Data:', taskData);

			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`❌ Server Error (${response.status}):`, errorText);
				showSnackbar(`Failed to create task: ${errorText}`, 'error');
				return;
			}

			const result = await response.json();
			showSnackbar(`${taskAmount} task(s) successfully created!`, 'success');
			handleClose();
		} catch (error) {
			showSnackbar('Server error. Try again later.', 'error');
			console.error('Task creation failed:', error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.default,
					color: theme.palette.primary.main,
					fontWeight: 'bold',
					p: 2,
				}}
			>
				{editingTask ? 'Edit Task' : 'Create Task'}
			</DialogTitle>
			<DialogContent
				sx={{ backgroundColor: theme.palette.background.default, p: 3 }}
			>
				{/* Step 1: Select Site */}
				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Select a Site</InputLabel>
					<Select
						value={site}
						onChange={(e) => handleSiteSelection(e.target.value)}
						disabled={loading}
					>
						{dropdownData?.shops?.map((shop) => (
							<MenuItem
								key={shop.id}
								value={shop.name}
								disabled={!shop.is_enabled}
							>
								{shop.name} {!shop.is_enabled ? '(Locked)' : ''}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{showFields && (
					<>
						{/* Product Input */}
						<TextField
							label="Product (SKU, Variant, URL, Keywords)"
							placeholder="+jordan -td"
							fullWidth
							value={product}
							onChange={(e) => setProduct(e.target.value)}
							sx={{ mb: 2 }}
						/>

						{/* Mode Selection */}
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Mode</InputLabel>
							<Select
								value={mode}
								onChange={(e) => setMode(e.target.value)}
								disabled={!site}
							>
								{dropdownData?.modes?.map((option) => (
									<MenuItem key={option.id} value={option.name}>
										{option.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Proxy List Selection */}
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Proxy List (Optional)</InputLabel>
							<Select
								value={proxyList}
								onChange={(e) => setProxyList(e.target.value)}
							>
								<MenuItem value="">None (Defaults to localhost)</MenuItem>
								{dropdownData?.proxyLists?.map((proxy, index) => (
									<MenuItem key={index} value={proxy}>
										{proxy}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Profile Selection */}
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Billing Profile (Optional)</InputLabel>
							<Select
								value={profile}
								onChange={(e) => setProfile(e.target.value)}
							>
								{dropdownData?.billingProfiles?.map((option, index) => (
									<MenuItem key={index} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</>
				)}
			</DialogContent>

			{/* Buttons (Task Amount + Add Task) */}
			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					px: 3,
				}}
			>
				{/* Task Amount Counter */}
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconButton
						onClick={() => setTaskAmount(Math.max(1, taskAmount - 1))}
					>
						<RemoveIcon />
					</IconButton>
					<Typography sx={{ mx: 1, fontWeight: 'bold' }}>
						{taskAmount}
					</Typography>
					<IconButton onClick={() => setTaskAmount(taskAmount + 1)}>
						<AddIcon />
					</IconButton>
				</Box>

				{/* Action Buttons */}
				<Box>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleSaveTask}
						variant="contained"
						disabled={isSaving || !site || !product || !mode}
					>
						+ Add Task
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
