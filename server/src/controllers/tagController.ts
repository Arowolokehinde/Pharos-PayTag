import { Request, Response, NextFunction } from 'express';
import Tag from '../models/Tag';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { ethers } from 'ethers';
import { getContracts } from '../config/web3';
import Transaction from '../models/Transaction';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;

        // Filtering
        const filter: Record<string, any> = {};

        // Filter by owner
        if (req.query.owner) {
            filter.owner = (req.query.owner as string).toLowerCase();
        }

        // Execute query
        const total = await Tag.countDocuments(filter);

        const tags = await Tag.find(filter)
            .sort({ createdAt: -1 })
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
            data: tags,
        });
    }
);

// @desc    Get tag by name
// @route   GET /api/tags/:name
// @access  Public
export const getTagByName = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;

        const tag = await Tag.findOne({ name });

        if (!tag) {
            return next(new ErrorResponse('Tag not found', 404));
        }

        res.status(200).json({
            success: true,
            data: tag,
        });
    }
);

// @desc    Get tags by owner
// @route   GET /api/tags/owner/:address
// @access  Public
export const getTagsByOwner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid address', 400));
        }

        const tags = await Tag.find({ owner: address.toLowerCase() });

        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags,
        });
    }
);

// @desc    Create tag
// @route   POST /api/tags
// @access  Private
// src/controllers/tagController.ts

// Update the createTag function to match the contract method
export const createTag = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;

        // Validate required fields
        if (!name) {
            return next(new ErrorResponse('Please provide a tag name', 400));
        }

        try {
            // Check if tag is available first using contract call
            const contracts = getContracts();
            const isAvailable = await contracts.payTagRegistry.isTagAvailable(name);

            if (!isAvailable) {
                return next(new ErrorResponse('Tag already exists', 400));
            }

            // Register tag on blockchain
            const tx = await contracts.payTagRegistry.registerTag(name);

            // Create the tag record in our database
            const tag = await Tag.create({
                name,
                owner: req.user?.address || "",
                address: req.user?.address || "",
            });

            // Track the transaction
            await Transaction.create({
                txHash: tx.hash,
                from: req.user?.address || tx.from,
                to: contracts.payTagRegistry.address,
                amount: "0",
                type: "tagRegistration",
                status: "pending",
                timestamp: new Date(),
                metadata: {
                    tag: name,
                },
            });

            res.status(201).json({
                success: true,
                data: tag,
                transaction: tx.hash,
            });
        } catch (error: any) {
            console.error("Error registering tag:", error);
            return next(new ErrorResponse(`Failed to register tag: ${error.message || "Unknown error"}`, 500));
        }
    }
);

// @desc    Update tag
// @route   PUT /api/tags/:name
// @access  Private
export const updateTag = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        const { address, owner } = req.body;

        if (owner && !ethers.isAddress(owner)) {
            return next(new ErrorResponse('Invalid owner address', 400));
        }

        if (address && !ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid address', 400));
        }

        const tag = await Tag.findOne({ name });

        if (!tag) {
            return next(new ErrorResponse('Tag not found', 404));
        }

        // Verify ownership (only the owner or admin can update the tag)
        if (
            req.user?.role !== 'admin' &&
            tag.owner.toLowerCase() !== req.user?.address.toLowerCase()
        ) {
            return next(new ErrorResponse('Not authorized to update this tag', 403));
        }

        // Update only provided fields
        if (address) tag.address = address.toLowerCase();
        if (owner) tag.owner = owner.toLowerCase();

        await tag.save();

        res.status(200).json({
            success: true,
            data: tag,
        });
    }
);

// @desc    Delete tag
// @route   DELETE /api/tags/:name
// @access  Private/Admin
export const deleteTag = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;

        const tag = await Tag.findOneAndDelete({ name });

        if (!tag) {
            return next(new ErrorResponse('Tag not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    }
);