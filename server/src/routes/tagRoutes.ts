import express from 'express';
import {
    getTags,
    getTagByName,
    getTagsByOwner,
    createTag,
    updateTag,
    deleteTag,
} from '../controllers/tagController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getTags);
router.get('/:name', getTagByName);
router.get('/owner/:address', getTagsByOwner);

// Protected routes
router.post('/', protect, createTag);
router.put('/:name', protect, updateTag);

// Admin routes
router.delete('/:name', protect, authorize(['admin']), deleteTag);

export default router;