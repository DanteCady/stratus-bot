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

	// Populate fields when editing
	useEffect(() => {
		if (editingTask) {
			// Find the full site and mode objects from dropdownData
			const selectedSite = dropdownData?.sites?.find(
				(s) => s.site_id === editingTask.site_id
			);
			const selectedMode = dropdownData?.modes?.find(
				(m) => m.mode_id === editingTask.mode_id
			);

			setSite(selectedSite?.site_name || '');
			setProduct(editingTask.product || '');
			setMode(selectedMode?.mode_name || '');
			setProxyList(editingTask.proxy_id || '');
			setProfile(editingTask.profile_id || '');
			setMonitorDelay(editingTask.monitor_delay || 3500);
			setErrorDelay(editingTask.error_delay || 3500);
			setTaskAmount(1); // Reset to 1 when editing
		} else {
			// Reset form when not editing
			setSite('');
			setProduct('');
			setMode('');
			setProxyList('');
			setProfile('');
			setMonitorDelay(3500);
			setErrorDelay(3500);
			setTaskAmount(1);
		}
	}, [editingTask, dropdownData]);

	// Debug the sites data when it changes
	useEffect(() => {
		if (dropdownData?.sites) {
			console.log('Available sites data:', dropdownData.sites);
		}
	}, [dropdownData]);

	// Handle site selection
	const handleSiteSelection = (value) => {
		setSite(value);
		setShowFields(true);
	};

	// Save task
	const handleSaveTask = async () => {
		console.log('🟡 Attempting to save task...');
		console.log('Current site selection:', site);
		console.log('Available sites:', dropdownData.sites);

		if (!selectedTaskGroup?.task_group_id) {
			showSnackbar('No task group selected.', 'error');
			console.error('❌ Task group is missing:', selectedTaskGroup);
			return;
		}

		if (!site || !product || !mode || taskAmount < 1) {
			showSnackbar('Please fill in all required fields.', 'error');
			console.error('❌ Missing required fields:', {
				site,
				product,
				mode,
				taskAmount,
			});
			return;
		}

		if (!dropdownData?.sites || !dropdownData?.modes) {
			showSnackbar('Dropdown data not available. Try again later.', 'error');
			console.error('❌ Dropdown data missing:', dropdownData);
			return;
		}

		// Debug logging
		console.log('Selected site name:', site);
		console.log('All available sites:', dropdownData.sites);
		console.log('Selected mode name:', mode);
		console.log('All available modes:', dropdownData.modes);

		// Find selected site and mode with more detailed matching
		const selectedSite = dropdownData.sites.find((s) => s.site_name === site);
		const selectedMode = dropdownData.modes.find((m) => m.mode_name === mode);

		console.log('Selected site object:', selectedSite);
		console.log('Selected mode object:', selectedMode);

		if (!selectedSite) {
			showSnackbar('Selected site not found.', 'error');
			console.error(
				'❌ Error: Site not found. Selected:',
				site,
				'Available sites:',
				dropdownData.sites
			);
			return;
		}

		if (!selectedMode?.mode_id) {
			showSnackbar('Invalid mode selected.', 'error');
			console.error(
				'❌ Error: Mode not found in dropdownData.modes',
				dropdownData.modes
			);
			return;
		}

		try {
			console.log('🔄 Fetching user session...');
			const response = await fetch('/api/auth/session');
			const session = await response.json();

			if (!session?.user?.id) {
				showSnackbar('User session expired. Please log in again.', 'error');
				console.error('❌ Error: User session is invalid or expired.', session);
				return;
			}

			const taskData = {
				task_id: crypto.randomUUID(),
				user_id: session.user.id,
				task_group_id: selectedTaskGroup.task_group_id,
				product: product,
				monitor_delay: parseInt(monitorDelay),
				error_delay: parseInt(errorDelay),
				mode_id: selectedMode.mode_id,
				status: 'pending',
				site_id: selectedSite.site_id,
				proxy_id: proxyList || null,
			};

			const taskResponse = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskData),
			});

			if (!taskResponse.ok) {
				const errorText = await taskResponse.text();
				console.error(`❌ Server Error (${taskResponse.status}):`, errorText);
				showSnackbar(`Failed to create task: ${errorText}`, 'error');
				return;
			}

			console.log('✅ Task successfully created:', taskData.task_id);
			showSnackbar(`${taskAmount} task(s) successfully created!`, 'success');
			handleClose();
		} catch (error) {
			showSnackbar('Server error. Try again later.', 'error');
			console.error('❌ Task creation failed:', error);
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
						{dropdownData?.sites?.map((siteItem) => (
							<MenuItem key={siteItem.site_id} value={siteItem.site_name}>
								{siteItem.site_name}
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
									<MenuItem key={option.mode_id} value={option.mode_name}>
										{option.mode_name}
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
