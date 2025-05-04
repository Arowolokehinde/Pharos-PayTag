import express from 'express';
import {
    getNetworks,
    getNetworkById,
    createNetwork,
    updateNetwork,
    toggleNetworkStatus,
    deleteNetwork,
} from '../controllers/networkController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getNetworks);
router.get('/:networkId', getNetworkById);

// Admin routes
router.post('/', protect, authorize(['admin']), createNetwork);
router.put('/:networkId', protect, authorize(['admin']), updateNetwork);
router.put('/:networkId/toggle', protect, authorize(['admin']), toggleNetworkStatus);
router.delete('/:networkId', protect, authorize(['admin']), deleteNetwork);

export default router;