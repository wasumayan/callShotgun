import express, { Request, Response, Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    createNewTrip,
    getUserTrips,
    generateTripName,
    getSuggestedMatches
} from '../controllers/tripController';

const router: Router = express.Router();

// Create a new trip
router.post('/', authenticateToken, createNewTrip);

// Get all trips for the authenticated user
router.get('/my-trips', getUserTrips);

// Generate a new trip name
router.post('/generate-name', generateTripName);

const findMatches: RequestHandler = async (req, res, next) => {
    try {
        // Implementation here
        res.json({ message: 'Matches found successfully' });
    } catch (error) {
        next(error);
    }
};

const updateTrip: RequestHandler = async (req, res, next) => {
    try {
        // Implementation here
        res.json({ message: 'Trip updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteTrip: RequestHandler = async (req, res, next) => {
    try {
        // Implementation here
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Apply authentication middleware to all routes
router.use(authenticateToken as RequestHandler);

// Trip routes
router.get('/:tripId/matches', findMatches);
router.put('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

router.get('/', getUserTrips);
router.get('/matches', getSuggestedMatches);

export default router; 