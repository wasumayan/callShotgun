import { Request, Response } from 'express';
import { Trip, createTrip, findMatchingTrips, pool } from '../models/Trip';

export const createNewTrip = async (req: Request, res: Response) => {
    try {
        const { destination, departureDate, arrivalDate, budget, transportModes } = req.body;
        const userId = (req as any).user.userId; // From auth middleware

        const trip = await createTrip({
            userId,
            destination,
            departureDate: new Date(departureDate),
            arrivalDate: new Date(arrivalDate),
            budget,
            transportModes
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Error creating trip' });
    }
};

export const findMatches = async (req: Request, res: Response) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const userId = (req as any).user.userId;

        // First get the trip details
        const trip = await getTripById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if user owns the trip
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to view matches for this trip' });
        }

        // Find matching trips
        const matches = await findMatchingTrips(trip);
        res.json(matches);
    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({ message: 'Error finding matches' });
    }
};

export const getTripById = async (tripId: number): Promise<Trip | null> => {
    try {
        const query = 'SELECT * FROM trips WHERE id = $1';
        const result = await pool.query(query, [tripId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting trip:', error);
        throw error;
    }
};

export const getUserTrips = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const query = 'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting user trips:', error);
        res.status(500).json({ message: 'Error getting user trips' });
    }
};

export const updateTrip = async (req: Request, res: Response) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const userId = (req as any).user.userId;
        const { destination, departureDate, arrivalDate, budget, transportModes } = req.body;

        // Check if trip exists and belongs to user
        const trip = await getTripById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this trip' });
        }

        const query = `
            UPDATE trips 
            SET destination = $1, departure_date = $2, arrival_date = $3, 
                budget = $4, transport_modes = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `;
        
        const values = [destination, departureDate, arrivalDate, budget, transportModes, tripId];
        const result = await pool.query(query, values);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ message: 'Error updating trip' });
    }
};

export const deleteTrip = async (req: Request, res: Response) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const userId = (req as any).user.userId;

        // Check if trip exists and belongs to user
        const trip = await getTripById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this trip' });
        }

        const query = 'DELETE FROM trips WHERE id = $1';
        await pool.query(query, [tripId]);
        
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Error deleting trip' });
    }
}; 