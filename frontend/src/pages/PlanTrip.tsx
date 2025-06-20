import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import debounce from 'lodash.debounce';

const travelStyles = [
  'Adventure',
  'Relaxation',
  'Cultural',
  'Nature',
  'Luxury',
  'Budget',
  'Group',
  'Solo',
];

const steps = [
  'Destinations & Dates',
  'Budget & Group Size',
  'Travel Style & Interests',
  'Flexibility & Notes',
  'Review & Confirm'
];

const PlanTrip: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [interests, setInterests] = useState('');
  const [flexibility, setFlexibility] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const navigate = useNavigate();
  const [destinationError, setDestinationError] = useState('');
  const [dateError, setDateError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [groupSizeError, setGroupSizeError] = useState('');
  const [travelStyleError, setTravelStyleError] = useState('');
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [interestOptions, setInterestOptions] = useState<string[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/trips`,
        {
          destination,
          departureDate: startDate,
          arrivalDate: endDate,
          budget,
          transportModes: [],
          tripName,
          interests,
          flexibility,
          notes,
          groupSize,
          travelStyle,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      setSnackbar({ open: true, message: 'Trip planned successfully!', severity: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setLoading(false);
      setSnackbar({ open: true, message: err?.response?.data?.message || 'Failed to plan trip. Please try again.', severity: 'error' });
    }
  };

  const validateStep = () => {
    let valid = true;
    setDestinationError('');
    setDateError('');
    setBudgetError('');
    setGroupSizeError('');
    setTravelStyleError('');
    if (activeStep === 0) {
      if (!destination.trim()) {
        setDestinationError('Destination is required');
        valid = false;
      }
      if (!startDate || !endDate) {
        setDateError('Both start and end dates are required');
        valid = false;
      } else if (startDate > endDate) {
        setDateError('Start date must be before end date');
        valid = false;
      }
    }
    if (activeStep === 1) {
      if (!budget || Number(budget) <= 0) {
        setBudgetError('Budget must be a positive number');
        valid = false;
      }
      if (!groupSize || Number(groupSize) <= 0) {
        setGroupSizeError('Group size must be a positive number');
        valid = false;
      }
    }
    if (activeStep === 2) {
      if (!travelStyle) {
        setTravelStyleError('Travel style is required');
        valid = false;
      }
    }
    return valid;
  };

  // Debounced fetch for destinations
  const fetchDestinations = debounce(async (input: string) => {
    setDestinationLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/suggestions/destinations`, {
        params: { query: input },
        withCredentials: true
      });
      setDestinationOptions(res.data.suggestions || []);
    } catch {
      setDestinationOptions([]);
    } finally {
      setDestinationLoading(false);
    }
  }, 300);

  // Debounced fetch for interests
  const fetchInterests = debounce(async (input: string) => {
    setInterestLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/suggestions/interests`, {
        params: { query: input },
        withCredentials: true
      });
      setInterestOptions(res.data.suggestions || []);
    } catch {
      setInterestOptions([]);
    } finally {
      setInterestLoading(false);
    }
  }, 300);

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h4" mb={2} align="center">Plan a Trip</Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <>
            <Autocomplete
              freeSolo
              options={destinationOptions}
              value={destination}
              loading={destinationLoading}
              onInputChange={(_, newValue) => {
                setDestination(newValue);
                fetchDestinations(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Destination(s)" required error={!!destinationError} helperText={destinationError || 'Where do you want to go?'} margin="normal" fullWidth />
              )}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!dateError}
              helperText={dateError || 'Trip start date'}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!dateError}
              helperText={dateError || 'Trip end date'}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <TextField
              label="Budget ($)"
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={!!budgetError}
              helperText={budgetError || 'Total budget for the trip'}
            />
            <TextField
              label="Group Size"
              type="number"
              value={groupSize}
              onChange={e => setGroupSize(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={!!groupSizeError}
              helperText={groupSizeError || 'How many people are going?'}
            />
          </>
        )}
        {activeStep === 2 && (
          <>
            <TextField
              label="Travel Style"
              select
              value={travelStyle}
              onChange={e => setTravelStyle(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={!!travelStyleError}
              helperText={travelStyleError || 'What kind of trip do you want?'}
            >
              {travelStyles.map(style => (
                <MenuItem key={style} value={style}>{style}</MenuItem>
              ))}
            </TextField>
            <Autocomplete
              multiple
              freeSolo
              options={interestOptions}
              value={interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : []}
              loading={interestLoading}
              onInputChange={(_, newValue) => {
                fetchInterests(newValue);
              }}
              onChange={(_, newValue) => setInterests(newValue.join(', '))}
              renderInput={(params) => (
                <TextField {...params} label="Interests" margin="normal" helperText="What are you interested in? (e.g. food, art, nature)" fullWidth />
              )}
            />
          </>
        )}
        {activeStep === 3 && (
          <>
            <Tooltip title="Let us know if your dates or budget are flexible!" arrow>
              <TextField
                label="Flexibility (e.g. dates, budget)"
                value={flexibility}
                onChange={e => setFlexibility(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Describe any flexibility you have."
              />
            </Tooltip>
            <TextField
              label="Notes / Description"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              helperText="Anything else we should know?"
            />
          </>
        )}
        {activeStep === 4 && (
          <>
            <TextField
              label="Trip Name (leave blank for AI suggestion)"
              value={tripName}
              onChange={e => setTripName(e.target.value)}
              fullWidth
              margin="normal"
              helperText="We'll generate a creative name if you leave this blank."
            />
            <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Trip Summary</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><b>Destination:</b> {destination}</Typography>
                <Typography variant="body2"><b>Dates:</b> {startDate} to {endDate}</Typography>
                <Typography variant="body2"><b>Budget:</b> ${budget}</Typography>
                <Typography variant="body2"><b>Group Size:</b> {groupSize}</Typography>
                <Typography variant="body2"><b>Travel Style:</b> {travelStyle}</Typography>
                <Typography variant="body2"><b>Interests:</b> {interests}</Typography>
                <Typography variant="body2"><b>Flexibility:</b> {flexibility}</Typography>
                <Typography variant="body2"><b>Notes:</b> {notes}</Typography>
              </CardContent>
            </Card>
          </>
        )}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">Back</Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" disabled={!validateStep()}>Next</Button>
          ) : (
            <LoadingButton type="submit" variant="contained" color="primary" loading={loading}>
              Plan Trip
            </LoadingButton>
          )}
        </Box>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanTrip; 