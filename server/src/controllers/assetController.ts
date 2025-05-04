import { Request, Response, NextFunction } from 'express';
import Asset from '../models/Asset';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { ethers } from 'ethers';
import Transaction from '../models/Transaction';
import { getContracts } from '../config/web3';

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
export const getAssets = asyncHandler(
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

        // Filter by verified status
        if (req.query.verified === 'true') {
            filter.verified = true;
        } else if (req.query.verified === 'false') {
            filter.verified = false;
        }

        // Execute query
        const total = await Asset.countDocuments(filter);

        const assets = await Asset.find(filter)
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
            data: assets,
        });
    }
);

// @desc    Get asset by ID
// @route   GET /api/assets/:assetId
// @access  Public
export const getAssetById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId } = req.params;

        const asset = await Asset.findOne({ assetId: parseInt(assetId) });

        if (!asset) {
            return next(new ErrorResponse('Asset not found', 404));
        }

        res.status(200).json({
            success: true,
            data: asset,
        });
    }
);

// @desc    Get assets by owner
// @route   GET /api/assets/owner/:address
// @access  Public
export const getAssetsByOwner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid address', 400));
        }

        const assets = await Asset.find({ owner: address.toLowerCase() });

        res.status(200).json({
            success: true,
            count: assets.length,
            data: assets,
        });
    }
);

// @desc    Create asset
// @route   POST /api/assets
// @access  Private
// src/controllers/assetController.ts

// Update the createAsset function to match the contract method
export const createAsset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, description, location, metadata, category, value } = req.body;

        // Validate required fields
        if (!name || !value) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        try {
            // Format value to match contract expectations (in wei)
            const valueInWei = ethers.parseEther(value.toString());

            // Convert category to enum value
            const categoryEnum = getCategoryEnum(category || "OTHER");

            // Get contracts
            const contracts = getContracts();

            // Register asset on blockchain
            const tx = await contracts.rwaAssetRegistry.registerAsset(
                name,
                description || "",
                location || "",
                metadata || "",
                categoryEnum,
                valueInWei
            );

            // Wait for transaction receipt to get assetId from events
            const receipt = await tx.wait();

            // Proper typed event filtering for Ethers v6
            const assetRegisteredLog = receipt.logs.find((log: ethers.Log) => {
                try {
                    const parsedLog = contracts.rwaAssetRegistry.interface.parseLog(log);
                    return parsedLog?.name === "AssetRegistered";
                } catch {
                    return false;
                }
            });

            if (!assetRegisteredLog) {
                throw new Error("AssetRegistered event not found in transaction logs");
            }

            const parsedLog = contracts.rwaAssetRegistry.interface.parseLog(assetRegisteredLog);
            const assetId = parsedLog?.args.assetId.toString();

            // Create asset record in our database
            const asset = await Asset.create({
                assetId,
                name,
                value,
                owner: req.user?.address || "",
                verified: false,
            });

            // Track the transaction
            await Transaction.create({
                txHash: tx.hash,
                from: req.user?.address || tx.from,
                to: contracts.rwaAssetRegistry.address,
                amount: value,
                type: "assetRegistration",
                status: "completed",
                blockNumber: receipt.blockNumber,
                timestamp: new Date(),
                metadata: {
                    assetId,
                    name,
                    category
                },
            });

            res.status(201).json({
                success: true,
                data: asset,
                transaction: tx.hash,
            });
        } catch (error: any) {
            console.error("Error registering asset:", error);
            return next(new ErrorResponse(`Failed to register asset: ${error.message || "Unknown error"}`, 500));
        }
    }
);

// Helper function to get category enum value
function getCategoryEnum(category: string): number {
    const categories = {
        "REAL_ESTATE": 0,
        "VEHICLE": 1,
        "EQUIPMENT": 2,
        "INTELLECTUAL_PROPERTY": 3,
        "OTHER": 4
    };

    return categories[category as keyof typeof categories] || 4; // Default to OTHER
}

// @desc    Update asset
// @route   PUT /api/assets/:assetId
// @access  Private
export const updateAsset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId } = req.params;
        const { name, value, owner, verified } = req.body;

        const asset = await Asset.findOne({ assetId: parseInt(assetId) });

        if (!asset) {
            return next(new ErrorResponse('Asset not found', 404));
        }

        // Verify ownership (only the owner or admin can update the asset)
        if (
            req.user?.role !== 'admin' &&
            asset.owner.toLowerCase() !== req.user?.address.toLowerCase()
        ) {
            return next(new ErrorResponse('Not authorized to update this asset', 403));
        }

        // Update fields
        if (name) asset.name = name;
        if (value) asset.value = value;
        if (owner && ethers.isAddress(owner)) {
            asset.owner = owner.toLowerCase();
        }

        // Only admin can verify assets
        if (typeof verified === 'boolean' && req.user?.role === 'admin') {
            asset.verified = verified;
        }

        await asset.save();

        res.status(200).json({
            success: true,
            data: asset,
        });
    }
);

// @desc    Verify asset
// @route   PUT /api/assets/:assetId/verify
// @access  Private/Admin
export const verifyAsset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId } = req.params;

        const asset = await Asset.findOne({ assetId: parseInt(assetId) });

        if (!asset) {
            return next(new ErrorResponse('Asset not found', 404));
        }

        // Update verified status
        asset.verified = true;
        await asset.save();

        res.status(200).json({
            success: true,
            data: asset,
        });
    }
);

// @desc    Delete asset
// @route   DELETE /api/assets/:assetId
// @access  Private/Admin
export const deleteAsset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId } = req.params;

        const asset = await Asset.findOneAndDelete({ assetId: parseInt(assetId) });

        if (!asset) {
            return next(new ErrorResponse('Asset not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    }
);