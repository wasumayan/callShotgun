import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createGroup, inviteUser, acceptInvite, declineInvite, listGroupMembers } from '../controllers/groupController';

const router = express.Router();

router.post('/', authenticateToken, createGroup);
router.post('/:groupId/invite', authenticateToken, inviteUser);
router.post('/:groupId/accept', authenticateToken, acceptInvite);
router.post('/:groupId/decline', authenticateToken, declineInvite);
router.get('/:groupId/members', authenticateToken, listGroupMembers);

export default router; 