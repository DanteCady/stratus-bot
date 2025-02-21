'use client';
import { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useProfileStore from '@/store/profileStore';
import ProfileModal from '@/components/global/profileModal';

export default function ProfileList() {
    const { profiles, deleteProfile } = useProfileStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const handleEdit = (profile) => {
        setSelectedProfile(profile);
        setOpenModal(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setSelectedProfile(null);
                    setOpenModal(true);
                }}
                sx={{ mb: 2 }}
            >
                + New Profile
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile Name</TableCell>
                            <TableCell>Billing Name</TableCell>
                            <TableCell>Card Type</TableCell>
                            <TableCell>Last 4 Digits</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profiles.map((profile) => (
                            <TableRow key={profile.id}>
                                <TableCell>{profile.profileName}</TableCell>
                                <TableCell>{profile.billingName}</TableCell>
                                <TableCell>{profile.cardType}</TableCell>
                                <TableCell>**** {profile.last4Digits}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(profile)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteProfile(profile.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Profile Modal */}
            <ProfileModal open={openModal} handleClose={() => setOpenModal(false)} profile={selectedProfile} />
        </Box>
    );
}
