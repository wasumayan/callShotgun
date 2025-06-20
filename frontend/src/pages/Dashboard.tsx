import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Grid } from '@mui/material';

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [tripsRes, matchesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/trips`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/trips/matches`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setTrips(tripsRes.data);
        setMatches(matchesRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>My Trips</Typography>
      <Grid container spacing={2}>
        {trips.map((trip) => (
          <Grid item xs={12} md={6} lg={4} key={trip.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{trip.tripName || trip.destination}</Typography>
                <Typography variant="body2">{trip.destination}</Typography>
                <Typography variant="body2">{trip.departureDate} - {trip.arrivalDate}</Typography>
                <Typography variant="body2">Budget: {trip.budget}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Suggested Matches</Typography>
        {matches.length === 0 ? (
          <Typography>No matches found yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {matches.map((match: any) => (
              <Grid item xs={12} md={6} lg={4} key={match.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{match.tripName || match.destination}</Typography>
                    <Typography variant="body2">{match.destination}</Typography>
                    <Typography variant="body2">{match.departureDate} - {match.arrivalDate}</Typography>
                    <Typography variant="body2">Budget: {match.budget}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 