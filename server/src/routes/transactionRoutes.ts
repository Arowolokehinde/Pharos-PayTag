import express from 'express';
import {
    getTransactions,
    getTransactionByHash,
    getUserTransactions,
    createTransaction,
    updateTransactionStatus,
} from '../controllers/transactionController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Protected routes
router.get('/', protect, getTransactions);
router.get('/:txHash', protect, getTransactionByHash);
router.get('/user/:address', protect, getUserTransactions);
router.post('/', protect, createTransaction);
router.put('/:txHash', protect, updateTransactionStatus);

export default router;