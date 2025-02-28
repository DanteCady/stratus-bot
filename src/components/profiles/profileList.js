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

    const handleDelete = (profileId, profileGroupId) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
            deleteProfile(profileId, profileGroupId);
        }
    };

    return (
        <Box>
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
                        {profiles.length > 0 ? (
                            profiles.map((profile) => (
                                <TableRow key={profile.profile_id}> {/* 🔹 Use `profile_id` instead of `id` */}
                                    <TableCell>{profile.profile_name}</TableCell>
                                    <TableCell>{profile.email}</TableCell>
                                    <TableCell>{profile.address || 'N/A'}</TableCell>
                                    <TableCell>
                                        {profile.card_number
                                            ? `**** ${profile.card_number.slice(-4)}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(profile)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(profile.profile_id, profile.profile_group_id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No profiles found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Profile Modal */}
            <ProfileModal open={openModal} handleClose={() => setOpenModal(false)} profile={selectedProfile} />
        </Box>
    );
}
