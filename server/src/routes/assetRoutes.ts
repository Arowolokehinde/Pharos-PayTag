import express from 'express';
import {
    getAssets,
    getAssetById,
    getAssetsByOwner,
    createAsset,
    updateAsset,
    verifyAsset,
    deleteAsset,
} from '../controllers/assetController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getAssets);
router.get('/:assetId', getAssetById);
router.get('/owner/:address', getAssetsByOwner);

// Protected routes
router.post('/', protect, createAsset);
router.put('/:assetId', protect, updateAsset);

// Admin routes
router.put('/:assetId/verify', protect, authorize(['admin']), verifyAsset);
router.delete('/:assetId', protect, authorize(['admin']), deleteAsset);

export default router;