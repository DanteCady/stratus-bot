'use client';
import { Box, useTheme } from '@mui/material';
import useProxyStore from '@/store/proxyStore';
import ControlButton from '../global/controlButton';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import SpeedIcon from '@mui/icons-material/Speed';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProxyControls({ openModal }) {
	const { deleteAllProxies, clearBadProxies } = useProxyStore();
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				width: '100%',
				border: `1px solid ${theme.palette.primary.main}`,
				padding: '10px',
				gap: 2,
			}}
		>
			{/* Actions */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				<ControlButton 
					icon={<AddIcon />} 
					text="Add Proxies" 
					variant="contained" 
					color="primary" 
					onClick={() => {
						console.log("Opening Proxy Modal..."); // Debugging
						openModal();
					}} 
				/>
				<ControlButton icon={<PublishIcon />} text="Import Proxies" variant="contained" color="secondary" />
				<ControlButton icon={<SpeedIcon />} text="Test Proxies" variant="contained" color="warning" />
				<ControlButton icon={<ClearIcon />} text="Clear Bad" variant="contained" color="info" onClick={clearBadProxies} />
				<ControlButton icon={<DeleteIcon />} text="Delete All" variant="contained" color="error" onClick={deleteAllProxies} />
			</Box>
		</Box>
	);
}
