import { Request, Response } from 'express';
import { pool } from '../models/Trip';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

// Helper to boost user's own preferences
function boostSuggestions(suggestions: string[], userPrefs: string[] | undefined): string[] {
  if (!userPrefs || userPrefs.length === 0) return suggestions;
  const boosted = [...userPrefs.filter(p => suggestions.includes(p)), ...suggestions.filter(s => !userPrefs.includes(s))];
  // Remove duplicates
  return [...new Set(boosted)];
}

export const suggestDestinations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const query = (req.query.query as string) || '';
    // Get user's past destinations
    const userTrips = await pool.query('SELECT DISTINCT destination FROM trips WHERE user_id = $1', [userId]);
    const userDestinations = userTrips.rows.map((row: any) => row.destination);
    // Get all matching destinations
    const result = await pool.query(
      'SELECT DISTINCT destination FROM trips WHERE LOWER(destination) LIKE $1 LIMIT 10',
      [`%${query.toLowerCase()}%`]
    );
    let suggestions = result.rows.map((row: any) => row.destination);
    // Boost user's own destinations
    suggestions = boostSuggestions(suggestions, userDestinations);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error suggesting destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destination suggestions' });
  }
};

export const suggestInterests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const query = (req.query.query as string) || '';
    // Get user's interests
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    const userInterests = user?.preferences?.interests || [];
    // Get all interests from all users
    const allUsers = await userRepo.find();
    let allInterests: string[] = [];
    allUsers.forEach(u => {
      if (u.preferences?.interests) {
        allInterests.push(...u.preferences.interests);
      }
    });
    // Filter and deduplicate
    let suggestions = Array.from(new Set(allInterests.filter(i => i.toLowerCase().includes(query.toLowerCase()))));
    // Boost user's own interests
    suggestions = boostSuggestions(suggestions, userInterests);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error suggesting interests:', error);
    res.status(500).json({ error: 'Failed to fetch interest suggestions' });
  }
}; 