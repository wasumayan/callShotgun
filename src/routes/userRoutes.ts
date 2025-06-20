import express, { Request, Response, Router, RequestHandler } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (need authentication)
router.get('/profile', authenticateToken, getUserProfile);

export default router; 