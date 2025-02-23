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
	Divider,
	useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDropdownData } from '@/context/dropdownData';
export default function DynamicModal({
	open,
	handleClose,
	saveTask,
	editingTask,
}) {
	const theme = useTheme();
	const { dropdownData, loading } = useDropdownData();

	const [site, setSite] = useState('');
	const [product, setProduct] = useState('');
	const [mode, setMode] = useState('');
	const [proxyList, setProxyList] = useState('');
	const [profile, setProfile] = useState('');
	const [monitorDelay, setMonitorDelay] = useState(3500);
	const [errorDelay, setErrorDelay] = useState(3500);
	const [taskAmount, setTaskAmount] = useState(1);
	const [showConfig, setShowConfig] = useState(false);

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
			setShowConfig(true);
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
			setShowConfig(false);
		}
	}, [open, editingTask]);

	// Handle site selection
	const handleSiteSelection = (value) => {
		setSite(value);
		setShowConfig(true);
		setMode('');
	};

	// Handle saving task
	const handleSaveTask = () => {
		const newTask = {
			id: editingTask ? editingTask.id : Date.now(),
			site,
			product,
			mode,
			proxy: proxyList || 'localhost',
			profile,
			monitorDelay,
			errorDelay,
			taskAmount,
			status: editingTask ? editingTask.status : 'Idle',
		};

		saveTask(newTask);
		handleClose();
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
						{dropdownData?.shops?.map((shop) => {
							const isEnabled =
								shop.is_enabled === 'true' || shop.is_enabled === 1; // Convert string to boolean
							return (
								<MenuItem
									key={shop.id}
									value={shop.name}
									disabled={!isEnabled} // Disable if not enabled
								>
									{shop.name} {!isEnabled ? '(Locked)' : ''}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>

				{/* Step 2: Show Additional Configurations */}
				{showConfig && (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
							Site: {site}
						</Typography>

						{/* Product Input */}
						<TextField
							label="Product (SKU, Variant, URL, Keywords)"
							placeholder="+jordan -td"
							fullWidth
							value={product}
							onChange={(e) => setProduct(e.target.value)}
						/>

						{/* Mode Selection (Changes Based on Site) */}
						<FormControl fullWidth>
							<InputLabel>Mode</InputLabel>
							<Select
								value={mode}
								onChange={(e) => setMode(e.target.value)}
								disabled={!site}
							>
								{dropdownData?.modes
									.filter((mode) => {
										// Find the selected site's shop_id
										const selectedSite = dropdownData.sites.find(
											(s) => s.name === site
										);
										return (
											selectedSite &&
											selectedSite.shop_id === dropdownData.shops[0]?.id
										);
									})
									.map((option) => (
										<MenuItem key={option.id} value={option.name}>
											{option.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						{/* Proxy List Selection */}
						<FormControl fullWidth>
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
						<FormControl fullWidth>
							<InputLabel>Billing Profile</InputLabel>
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

						{/* Monitor & Error Delays */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 4,
								mt: 2,
							}}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography sx={{ color: theme.palette.primary.main }}>
									Monitor Delay (ms)
								</Typography>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<IconButton
										onClick={() => setMonitorDelay(monitorDelay - 500)}
										disabled={monitorDelay <= 500}
									>
										<RemoveIcon />
									</IconButton>
									<Typography sx={{ mx: 2, fontWeight: 'bold' }}>
										{monitorDelay}
									</Typography>
									<IconButton
										onClick={() => setMonitorDelay(monitorDelay + 500)}
									>
										<AddIcon />
									</IconButton>
								</Box>
							</Box>
							<Box sx={{ textAlign: 'center' }}>
								<Typography sx={{ color: theme.palette.primary.main }}>
									Error Delay (ms)
								</Typography>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<IconButton
										onClick={() => setErrorDelay(errorDelay - 500)}
										disabled={errorDelay <= 500}
									>
										<RemoveIcon />
									</IconButton>
									<Typography sx={{ mx: 2, fontWeight: 'bold' }}>
										{errorDelay}
									</Typography>
									<IconButton onClick={() => setErrorDelay(errorDelay + 500)}>
										<AddIcon />
									</IconButton>
								</Box>
							</Box>
						</Box>
					</Box>
				)}
			</DialogContent>

			{/* Buttons */}
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button
					onClick={handleSaveTask}
					variant="contained"
					disabled={!site || !product || !mode || !profile}
				>
					{editingTask ? 'Save Changes' : '+ Add Task'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
