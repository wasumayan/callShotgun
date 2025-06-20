import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Itinerary: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [itinerary, setItinerary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.post(`${process.env.REACT_APP_API_URL}/api/itineraries/${tripId}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setItinerary(res.data.itinerary || ''))
      .catch(() => setError('Failed to generate itinerary.'))
      .finally(() => setLoading(false));
  }, [tripId]);

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Trip Itinerary</Typography>
      {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
        <Paper sx={{ p: 3 }}>
          <Typography>{itinerary}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Itinerary; 