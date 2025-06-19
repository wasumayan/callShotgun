import express, { Request, Response, Router, RequestHandler } from 'express';
import { googleMapsService } from '../services/googleMapsService';

const router: Router = express.Router();

// Test endpoint to verify Google Maps integration
const testHandler: RequestHandler = async (req, res, next) => {
    try {
        // Test geocoding with a known address
        const location = await googleMapsService.geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');
        res.json({
            status: 'success',
            message: 'Google Maps API is working correctly',
            testLocation: location
        });
    } catch (error) {
        next(error);
    }
};

// Geocode an address
const geocodeHandler: RequestHandler = async (req, res, next) => {
    try {
        const { address } = req.query;
        if (!address || typeof address !== 'string') {
            res.status(400).json({ error: 'Address is required' });
            return;
        }

        const location = await googleMapsService.geocodeAddress(address);
        res.json(location);
    } catch (error) {
        next(error);
    }
};

// Get directions between two points
const directionsHandler: RequestHandler = async (req, res, next) => {
    try {
        const { origin, destination, mode } = req.query;
        if (!origin || !destination) {
            res.status(400).json({ error: 'Origin and destination are required' });
            return;
        }

        const route = await googleMapsService.getDirections(
            origin as string,
            destination as string,
            mode as any
        );
        res.json(route);
    } catch (error) {
        next(error);
    }
};

// Search for nearby places
const nearbyPlacesHandler: RequestHandler = async (req, res, next) => {
    try {
        const { lat, lng, radius, type } = req.query;
        if (!lat || !lng) {
            res.status(400).json({ error: 'Latitude and longitude are required' });
            return;
        }

        const location = {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
            address: ''
        };

        const places = await googleMapsService.searchNearbyPlaces(
            location,
            radius ? parseInt(radius as string) : undefined,
            type as string
        );
        res.json(places);
    } catch (error) {
        next(error);
    }
};

// Get details for a specific place
const placeDetailsHandler: RequestHandler = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        if (!placeId) {
            res.status(400).json({ error: 'Place ID is required' });
            return;
        }

        const place = await googleMapsService.getPlaceDetails(placeId);
        res.json(place);
    } catch (error) {
        next(error);
    }
};

router.get('/test', testHandler);
router.get('/geocode', geocodeHandler);
router.get('/directions', directionsHandler);
router.get('/places/nearby', nearbyPlacesHandler);
router.get('/places/:placeId', placeDetailsHandler);

export default router; 