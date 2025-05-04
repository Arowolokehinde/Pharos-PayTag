import express from 'express';
import {
    getNonce,
    authenticateUser,
    getCurrentUser,
    updateProfile,
    setUserRole,
} from '../controllers/userController';
import { protect, authorize, verifySignature } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/nonce/:address', getNonce);
router.post('/auth', authenticateUser);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateProfile);

// Admin routes
router.put('/:id/role', protect, authorize(['admin']), setUserRole);

export default router;