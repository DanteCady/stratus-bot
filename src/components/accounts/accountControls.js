'use client';
import { Box, Button } from '@mui/material';
import useAccountStore from '@/store/accountStore';
import ControlButton from '../global/controlButton';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AccountControls({ openModal }) {
    const { deleteAllAccounts } = useAccountStore();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '10px', gap: 2 }}>
            <ControlButton icon={<AddIcon />} text="Add Accounts" variant="contained" color="primary" onClick={openModal} />
            <ControlButton icon={<PublishIcon />} text="Import" variant="contained" color="secondary" />
            <ControlButton icon={<DeleteIcon />} text="Delete All" variant="contained" color="error" onClick={deleteAllAccounts} />
        </Box>
    );
}
