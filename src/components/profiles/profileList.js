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
import ProfileModal from '@/components/profiles/profileModal';

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
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Last 4 Digits</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profiles.map((profile) => (
                            <TableRow key={profile.id}>
                                <TableCell>{profile.profile_name}</TableCell>
                                <TableCell>{profile.email}</TableCell>
                                <TableCell>{profile.address}</TableCell>
                                <TableCell>**** {profile.card_number.slice(-4)}</TableCell>
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
