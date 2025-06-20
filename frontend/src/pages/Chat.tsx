import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Divider, Typography, Paper, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const Chat: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    // Fetch groups (stub)
    setLoadingGroups(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/groups`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setGroups(res.data || []);
        setLoadingGroups(false);
      })
      .catch(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoadingMessages(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/messages/group/${selectedGroup.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setMessages(res.data || []);
        setLoadingMessages(false);
      })
      .catch(() => setLoadingMessages(false));
  }, [selectedGroup]);

  const handleSend = async () => {
    if (!input.trim() || !selectedGroup) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/group/${selectedGroup.id}`, { text: input }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setInput('');
    // Re-fetch messages
    axios.get(`${process.env.REACT_APP_API_URL}/api/messages/group/${selectedGroup.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setMessages(res.data || []));
  };

  return (
    <Box display="flex" height="80vh" boxShadow={2}>
      {/* Sidebar */}
      <Box width={280} bgcolor="#f5f5f5" borderRight={1} borderColor="#ddd" display="flex" flexDirection="column">
        <Typography variant="h6" p={2}>Groups</Typography>
        <Divider />
        {loadingGroups ? <CircularProgress sx={{ m: 2 }} /> : (
          <List>
            {groups.map((group) => (
              <ListItem button selected={selectedGroup?.id === group.id} key={group.id} onClick={() => setSelectedGroup(group)}>
                <ListItemText primary={group.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        <Paper elevation={0} sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#fafafa' }}>
          {selectedGroup ? (
            loadingMessages ? <CircularProgress /> : (
              messages.length === 0 ? <Typography color="text.secondary">No messages yet.</Typography> : (
                messages.map((msg, idx) => (
                  <Box key={idx} mb={2} display="flex" flexDirection="column" alignItems={msg.isMine ? 'flex-end' : 'flex-start'}>
                    <Paper sx={{ p: 1.5, bgcolor: msg.isMine ? '#d1e7dd' : '#fff' }}>
                      <Typography variant="body2"><b>{msg.senderName || 'User'}</b></Typography>
                      <Typography variant="body1">{msg.text}</Typography>
                      <Typography variant="caption" color="text.secondary">{msg.timestamp}</Typography>
                    </Paper>
                  </Box>
                ))
              )
            )
          ) : <Typography color="text.secondary">Select a group to start chatting.</Typography>}
        </Paper>
        {/* Message Input */}
        <Box display="flex" p={2} borderTop={1} borderColor="#eee" bgcolor="#fff">
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            size="small"
          />
          <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat; 