import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { suggestDestinations, suggestInterests } from '../controllers/suggestionController';

const router = express.Router();

router.get('/destinations', authenticateToken, suggestDestinations);
router.get('/interests', authenticateToken, suggestInterests);

export default router; 