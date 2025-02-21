import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import useProfileStore from '@/store/profileStore';

export default function ProfileSidebar() {
    const { profileGroups, selectedGroup, addProfileGroup, selectProfileGroup } = useProfileStore();

    return (
        <Box sx={{ width: 250, p: 2, borderRight: '1px solid grey' }}>
            <Typography variant="h6">Profile Groups</Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    const newGroup = { id: Date.now(), name: `New Group ${profileGroups.length + 1}` };
                    addProfileGroup(newGroup);
                    selectProfileGroup(newGroup);  // Auto-switch to new group
                }}
                sx={{ mt: 2, mb: 2 }}
            >
                + New Group
            </Button>
            <List>
                {profileGroups.map((group) => (
                    <ListItem
                        key={group.id}
                        button
                        selected={selectedGroup?.id === group.id}
                        onClick={() => selectProfileGroup(group)}
                        sx={{
                            backgroundColor: selectedGroup?.id === group.id ? 'primary.light' : 'transparent',
                            '&:hover': { backgroundColor: 'primary.dark' },
                        }}
                    >
                        <ListItemText primary={group.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
