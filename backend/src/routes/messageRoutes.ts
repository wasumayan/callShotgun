import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { sendMessage, getGroupMessages, getDirectMessages } from '../controllers/messageController';

const router = express.Router();

router.post('/group/:groupId', authenticateToken, sendMessage);
router.get('/group/:groupId', authenticateToken, getGroupMessages);
router.get('/direct/:userId', authenticateToken, getDirectMessages);

export default router; 