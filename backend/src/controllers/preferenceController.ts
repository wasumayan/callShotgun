import { Request, Response } from 'express';
import { pool } from '../models/Trip';

export const getUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            // Create default preferences if none exist
            return createDefaultPreferences(req, res);
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error getting user preferences:', error);
        res.status(500).json({ message: 'Error getting user preferences' });
    }
};

export const updateUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const {
            destination_weight,
            date_overlap_weight,
            budget_weight,
            transport_weight,
            max_budget_difference,
            min_date_overlap,
            required_transport_modes,
            excluded_transport_modes,
            preferred_age_range_min,
            preferred_age_range_max,
            preferred_gender,
            preferred_languages,
            preferred_interests
        } = req.body;

        // Validate weights sum to 1
        const totalWeight = destination_weight + date_overlap_weight + budget_weight + transport_weight;
        if (Math.abs(totalWeight - 1) > 0.001) {
            return res.status(400).json({ message: 'Weights must sum to 1' });
        }

        const query = `
            INSERT INTO user_preferences (
                user_id, destination_weight, date_overlap_weight, budget_weight, transport_weight,
                max_budget_difference, min_date_overlap, required_transport_modes, excluded_transport_modes,
                preferred_age_range_min, preferred_age_range_max, preferred_gender,
                preferred_languages, preferred_interests
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (user_id) DO UPDATE SET
                destination_weight = EXCLUDED.destination_weight,
                date_overlap_weight = EXCLUDED.date_overlap_weight,
                budget_weight = EXCLUDED.budget_weight,
                transport_weight = EXCLUDED.transport_weight,
                max_budget_difference = EXCLUDED.max_budget_difference,
                min_date_overlap = EXCLUDED.min_date_overlap,
                required_transport_modes = EXCLUDED.required_transport_modes,
                excluded_transport_modes = EXCLUDED.excluded_transport_modes,
                preferred_age_range_min = EXCLUDED.preferred_age_range_min,
                preferred_age_range_max = EXCLUDED.preferred_age_range_max,
                preferred_gender = EXCLUDED.preferred_gender,
                preferred_languages = EXCLUDED.preferred_languages,
                preferred_interests = EXCLUDED.preferred_interests,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        const values = [
            userId, destination_weight, date_overlap_weight, budget_weight, transport_weight,
            max_budget_difference, min_date_overlap, required_transport_modes, excluded_transport_modes,
            preferred_age_range_min, preferred_age_range_max, preferred_gender,
            preferred_languages, preferred_interests
        ];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Error updating user preferences' });
    }
};

const createDefaultPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const query = `
            INSERT INTO user_preferences (user_id)
            VALUES ($1)
            RETURNING *
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating default preferences:', error);
        res.status(500).json({ message: 'Error creating default preferences' });
    }
}; 