import { Pool } from 'pg';

// Database connection pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// TypeScript interfaces
export interface Trip {
    id: number;
    userId: number;
    destination: string;
    departureDate: Date;
    arrivalDate: Date;
    budget: number;
    transportModes: string[];
    createdAt: Date;
    updatedAt: Date;
    tripName?: string;
    interests?: string[];
    flexibility?: string;
    notes?: string;
    groupSize?: number;
    travelStyle?: string;
}

export interface UserPreferences {
    userId: number;
    weights: {
        destination: number;    // Weight for destination match
        dateOverlap: number;    // Weight for date overlap
        budget: number;         // Weight for budget compatibility
        transport: number;      // Weight for transport mode match
    };
    constraints: {
        maxBudgetDifference: number;  // Maximum acceptable budget difference (as percentage)
        requiredTransportModes: string[];  // Transport modes that must match
        excludedTransportModes: string[];  // Transport modes that must not match
        minDateOverlap: number;  // Minimum required date overlap (in days)
    };
}

export interface TripMatch {
    tripId: number;
    matchScore: number;
    matchingTrip: Trip;
    matchDetails: {
        destinationScore: number;
        dateOverlapScore: number;
        budgetScore: number;
        transportScore: number;
    };
}

// Database queries
export const createTrip = async (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
    const { userId, destination, departureDate, arrivalDate, budget, transportModes } = trip;
    
    const query = `
        INSERT INTO trips (user_id, destination, departure_date, arrival_date, budget, transport_modes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    
    const values = [userId, destination, departureDate, arrivalDate, budget, transportModes];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
};

export const getUserPreferences = async (userId: number): Promise<UserPreferences> => {
    const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
    try {
        const result = await pool.query(query, [userId]);
        return result.rows[0] || getDefaultPreferences(userId);
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return getDefaultPreferences(userId);
    }
};

const getDefaultPreferences = (userId: number): UserPreferences => ({
    userId,
    weights: {
        destination: 0.4,
        dateOverlap: 0.3,
        budget: 0.2,
        transport: 0.1
    },
    constraints: {
        maxBudgetDifference: 0.5,  // 50% difference
        requiredTransportModes: [],
        excludedTransportModes: [],
        minDateOverlap: 1  // 1 day minimum
    }
});

export const findMatchingTrips = async (trip: Trip): Promise<TripMatch[]> => {
    try {
        // Get user preferences
        const preferences = await getUserPreferences(trip.userId);
        
        // Get all potential matching trips
        const query = `
            SELECT t.*, u.weights, u.constraints
            FROM trips t
            JOIN user_preferences u ON t.user_id = u.user_id
            WHERE t.user_id != $1
            AND t.departure_date BETWEEN $2 AND $3
        `;
        
        const values = [
            trip.userId,
            new Date(trip.departureDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            new Date(trip.arrivalDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        ];
        
        const result = await pool.query(query, values);
        
        // Calculate match scores for each potential trip
        const matches = result.rows
            .map(potentialTrip => {
                const matchDetails = calculateMatchDetails(trip, potentialTrip, preferences);
                const matchScore = calculateWeightedScore(matchDetails, preferences.weights);
                
                // Check if the match meets all constraints
                if (!meetsConstraints(trip, potentialTrip, preferences.constraints)) {
                    return null;
                }
                
                return {
                    tripId: potentialTrip.id,
                    matchScore,
                    matchingTrip: potentialTrip,
                    matchDetails
                };
            })
            .filter((match): match is TripMatch => match !== null)
            .sort((a, b) => b.matchScore - a.matchScore);
        
        return matches;
    } catch (error) {
        console.error('Error finding matching trips:', error);
        throw error;
    }
};

interface MatchDetails {
    destinationScore: number;
    dateOverlapScore: number;
    budgetScore: number;
    transportScore: number;
}

const calculateMatchDetails = (
    trip1: Trip,
    trip2: Trip,
    preferences: UserPreferences
): MatchDetails => {
    return {
        destinationScore: calculateDestinationScore(trip1.destination, trip2.destination),
        dateOverlapScore: calculateDateOverlap(
            trip1.departureDate,
            trip1.arrivalDate,
            trip2.departureDate,
            trip2.arrivalDate
        ),
        budgetScore: calculateBudgetScore(trip1.budget, trip2.budget),
        transportScore: calculateTransportScore(trip1.transportModes, trip2.transportModes)
    };
};

const calculateWeightedScore = (
    details: MatchDetails,
    weights: UserPreferences['weights']
): number => {
    return (
        details.destinationScore * weights.destination +
        details.dateOverlapScore * weights.dateOverlap +
        details.budgetScore * weights.budget +
        details.transportScore * weights.transport
    );
};

const meetsConstraints = (
    trip1: Trip,
    trip2: Trip,
    constraints: UserPreferences['constraints']
): boolean => {
    // Check budget difference
    const budgetDifference = Math.abs(trip1.budget - trip2.budget) / Math.max(trip1.budget, trip2.budget);
    if (budgetDifference > constraints.maxBudgetDifference) {
        return false;
    }

    // Check required transport modes
    if (constraints.requiredTransportModes.length > 0) {
        const hasAllRequired = constraints.requiredTransportModes.every(mode =>
            trip1.transportModes.includes(mode) && trip2.transportModes.includes(mode)
        );
        if (!hasAllRequired) {
            return false;
        }
    }

    // Check excluded transport modes
    if (constraints.excludedTransportModes.length > 0) {
        const hasExcluded = constraints.excludedTransportModes.some(mode =>
            trip1.transportModes.includes(mode) || trip2.transportModes.includes(mode)
        );
        if (hasExcluded) {
            return false;
        }
    }

    // Check minimum date overlap
    const overlapDays = calculateDateOverlap(
        trip1.departureDate,
        trip1.arrivalDate,
        trip2.departureDate,
        trip2.arrivalDate
    ) * (trip1.arrivalDate.getTime() - trip1.departureDate.getTime()) / (1000 * 60 * 60 * 24);

    return overlapDays >= constraints.minDateOverlap;
};

const calculateDestinationScore = (dest1: string, dest2: string): number => {
    return dest1.toLowerCase() === dest2.toLowerCase() ? 1 : 0;
};

const calculateDateOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): number => {
    const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
    const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
    
    if (overlapEnd <= overlapStart) return 0;
    
    const totalDays = (end1.getTime() - start1.getTime()) / (1000 * 60 * 60 * 24);
    const overlapDays = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(1, overlapDays / totalDays);
};

const calculateBudgetScore = (budget1: number, budget2: number): number => {
    const ratio = Math.min(budget1, budget2) / Math.max(budget1, budget2);
    return ratio;
};

const calculateTransportScore = (modes1: string[], modes2: string[]): number => {
    const commonModes = modes1.filter(mode => modes2.includes(mode));
    return commonModes.length / Math.max(modes1.length, modes2.length);
}; 