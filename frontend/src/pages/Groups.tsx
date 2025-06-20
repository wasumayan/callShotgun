import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch groups and invites (stub)
    axios.get(`${process.env.REACT_APP_API_URL}/api/groups`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setGroups(res.data || []));
    axios.get(`${process.env.REACT_APP_API_URL}/api/groups/invites`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setInvites(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = (inviteId: number) => {
    // Accept invite (stub)
    axios.post(`${process.env.REACT_APP_API_URL}/api/groups/${inviteId}/accept`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => setInvites(invites.filter(i => i.id !== inviteId)));
  };
  const handleDecline = (inviteId: number) => {
    // Decline invite (stub)
    axios.post(`${process.env.REACT_APP_API_URL}/api/groups/${inviteId}/decline`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => setInvites(invites.filter(i => i.id !== inviteId)));
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Your Groups</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {groups.map((group) => (
            <ListItem key={group.id} divider>
              <ListItemText primary={group.name} />
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" mb={2}>Pending Invites</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {invites.length === 0 ? <Typography color="text.secondary">No pending invites.</Typography> : invites.map((invite) => (
            <ListItem key={invite.id} divider>
              <ListItemText primary={invite.groupName} />
              <Button color="primary" onClick={() => handleAccept(invite.id)}>Accept</Button>
              <Button color="secondary" onClick={() => handleDecline(invite.id)}>Decline</Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Groups; 