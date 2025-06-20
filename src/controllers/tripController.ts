import { Request, Response } from 'express';
import { Trip, createTrip, findMatchingTrips, pool } from '../models/Trip';
import OpenAI from 'openai';
import { getRepository } from 'typeorm';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createNewTrip = async (req: Request, res: Response) => {
    try {
        const { destination, departureDate, arrivalDate, budget, transportModes, tripName, interests, flexibility, notes, groupSize, travelStyle } = req.body;
        const userId = (req as any).user.userId; // From auth middleware

        const trip = await createTrip({
            userId,
            destination,
            departureDate: new Date(departureDate),
            arrivalDate: new Date(arrivalDate),
            budget,
            transportModes,
            tripName,
            interests,
            flexibility,
            notes,
            groupSize,
            travelStyle,
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
        const tripRepository = getRepository(Trip);
        const trips = await tripRepository.find({ where: { user: userId } });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch trips.' });
    }
};

export const getSuggestedMatches = async (req: Request, res: Response) => {
    // TODO: Implement real matching logic
    res.json([]);
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

export const generateTripName = async (req: Request, res: Response) => {
    try {
        const { destination, travelStyle, interests, groupSize, budget, notes } = req.body;
        const prompt = `Suggest a creative, catchy trip name for a journey with these details:\nDestination: ${destination}\nTravel Style: ${travelStyle}\nInterests: ${interests}\nGroup Size: ${groupSize}\nBudget: ${budget}\nNotes: ${notes}`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a creative travel planner.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 16,
            temperature: 0.9
        });
        const name = completion.choices[0].message?.content?.trim() || 'Epic Adventure';
        res.json({ name });
    } catch (error) {
        console.error('Error generating trip name:', error);
        res.status(500).json({ error: 'Failed to generate trip name' });
    }
}; 