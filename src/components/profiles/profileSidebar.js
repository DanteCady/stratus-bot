import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import useProfileStore from '@/store/profileStore';

export default function ProfileSidebar() {
    const { profileGroups, selectedGroup, addProfileGroup, deleteProfileGroup } = useProfileStore();

    return (
        <Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
            <Typography variant="h6">Profile Groups</Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => addProfileGroup({ id: Date.now(), name: `New Group` })}
                sx={{ mt: 2, mb: 2 }}
            >
                + New Group
            </Button>
            <List>
                {profileGroups.length > 0 ? (
                    profileGroups.map((group) => (
                        <ListItem
                            key={group.id}
                            button
                            selected={selectedGroup?.id === group.id}
                            onClick={() => useProfileStore.setState({ selectedGroup: group })}
                        >
                            <ListItemText primary={group.name} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No profile groups found</Typography>
                )}
            </List>
        </Box>
    );
}
