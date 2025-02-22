'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import ProxySidebar from '@/components/proxies/proxySidebar';
import ProxyControls from '@/components/proxies/proxyControls';
import ProxyTable from '@/components/proxies/proxyTable';
import ProxyModal from '@/components/proxies/proxyModal';
import useProxyStore from '@/store/proxyStore';

export default function Proxies() {
	const { addProxies } = useProxyStore();
	const [openModal, setOpenModal] = useState(false);

	const handleCloseModal = () => setOpenModal(false);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar for Proxy Groups */}
			<ProxySidebar />

			{/* Main Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{/* Proxy Controls */}
				<ProxyControls openModal={() => setOpenModal(true)} />

				{/* Proxies Table */}
				<ProxyTable />

				{/* Proxy Modal */}
				<ProxyModal open={openModal} handleClose={handleCloseModal} addProxies={addProxies} />
			</Box>
		</Box>
	);
}
