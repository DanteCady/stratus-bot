'use client';
import { Box, useTheme, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ControlButton from '@/components/global/controlButton';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import useProfileStore from '@/store/profileStore';
import ConfirmationModal from '@/components/global/confirmationModal';
import { useState } from 'react';

export default function ProfileControls({ openModal }) {
    const theme = useTheme();
    const { profiles, deleteAllProfiles } = useProfileStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDeleteAll = () => {
        deleteAllProfiles();
        setConfirmDelete(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                border: `1px solid ${theme.palette.primary.main}`,
                padding: '10px',
                gap: 2,
            }}
        >
            {/* Search Bar */}
            <TextField
                label="Search Profiles"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <ControlButton icon={<AddIcon />} text="New Profile" color="success" onClick={openModal} />
                <ControlButton icon={<UploadIcon />} text="Import" color="primary" />
                <ControlButton icon={<DownloadIcon />} text="Export" color="secondary" />
                <ControlButton
                    icon={<DeleteIcon />}
                    text="Delete All"
                    color="error"
                    onClick={() => setConfirmDelete(true)}
                    disabled={profiles.length === 0}
                />
            </Box>

            {/* Confirmation Modal for Deleting All Profiles */}
            <ConfirmationModal
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={handleDeleteAll}
                title="Delete All Profiles?"
                description="This action cannot be undone. Are you sure you want to delete all profiles?"
            />
        </Box>
    );
}
