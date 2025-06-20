import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateItinerary } from '../controllers/itineraryController';

const router = express.Router();

router.post('/:tripId', authenticateToken, generateItinerary);

export default router; 