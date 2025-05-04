import { Request, Response, NextFunction } from 'express';
import Transaction from '../models/Transaction';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { ethers } from 'ethers';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;

        // Filtering
        const filter: Record<string, any> = {};

        // Filter by address (from or to)
        if (req.query.address) {
            const address = (req.query.address as string).toLowerCase();
            filter.$or = [{ from: address }, { to: address }];
        }

        // Filter by type
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Execute query
        const total = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .sort({ timestamp: -1 })
            .skip(startIndex)
            .limit(limit);

        // Pagination result
        const pagination = {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            perPage: limit,
        };

        res.status(200).json({
            success: true,
            pagination,
            data: transactions,
        });
    }
);

// @desc    Get transaction by hash
// @route   GET /api/transactions/:txHash
// @access  Private
export const getTransactionByHash = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { txHash } = req.params;

        const transaction = await Transaction.findOne({ txHash });

        if (!transaction) {
            return next(new ErrorResponse('Transaction not found', 404));
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    }
);

// @desc    Get user transactions
// @route   GET /api/transactions/user/:address
// @access  Private
export const getUserTransactions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid address', 400));
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;

        // Filter transactions where user is sender or recipient
        const filter = {
            $or: [
                { from: address.toLowerCase() },
                { to: address.toLowerCase() },
            ],
        };

        // Execute query
        const total = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .sort({ timestamp: -1 })
            .skip(startIndex)
            .limit(limit);

        // Pagination result
        const pagination = {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            perPage: limit,
        };

        res.status(200).json({
            success: true,
            pagination,
            data: transactions,
        });
    }
);

// @desc    Create transaction (for tracking off-chain)
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { txHash, from, to, amount, type, status, blockNumber, timestamp, metadata } = req.body;

        // Validate required fields
        if (!txHash || !from || !to || !amount || !type) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        // Check if transaction already exists
        const existingTransaction = await Transaction.findOne({ txHash });

        if (existingTransaction) {
            return next(new ErrorResponse('Transaction already exists', 400));
        }

        // Create transaction
        const transaction = await Transaction.create({
            txHash,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            amount,
            type,
            status: status || 'pending',
            blockNumber,
            timestamp: timestamp || new Date(),
            metadata,
        });

        res.status(201).json({
            success: true,
            data: transaction,
        });
    }
);

// @desc    Update transaction status
// @route   PUT /api/transactions/:txHash
// @access  Private
export const updateTransactionStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { txHash } = req.params;
        const { status, blockNumber } = req.body;

        if (!['pending', 'completed', 'failed'].includes(status)) {
            return next(new ErrorResponse('Invalid status', 400));
        }

        const transaction = await Transaction.findOneAndUpdate(
            { txHash },
            {
                status,
                blockNumber,
                ...(status === 'completed' && { timestamp: new Date() }),
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!transaction) {
            return next(new ErrorResponse('Transaction not found', 404));
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    }
);