'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import ProxySidebar from '@/components/proxies/proxySidebar';
import ProxyControls from '@/components/proxies/proxyControls';
import ProxyTable from '@/components/proxies/proxyTable';

export default function Proxies() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <ProxySidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {/* Proxy Controls */}
                <ProxyControls openModal={() => setOpenModal(true)} />

                {/* Proxy Table */}
                <ProxyTable />
            </Box>
        </Box>
    );
}
