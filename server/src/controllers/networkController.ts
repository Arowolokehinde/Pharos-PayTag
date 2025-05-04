import { Request, Response, NextFunction } from 'express';
import Network from '../models/Network';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';

// @desc    Get all networks
// @route   GET /api/networks
// @access  Public
export const getNetworks = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Filter by active status
        const filter: Record<string, any> = {};

        if (req.query.active === 'true') {
            filter.active = true;
        } else if (req.query.active === 'false') {
            filter.active = false;
        }

        const networks = await Network.find(filter).sort({ networkId: 1 });

        res.status(200).json({
            success: true,
            count: networks.length,
            data: networks,
        });
    }
);

// @desc    Get network by ID
// @route   GET /api/networks/:networkId
// @access  Public
export const getNetworkById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId } = req.params;

        const network = await Network.findOne({ networkId: parseInt(networkId) });

        if (!network) {
            return next(new ErrorResponse('Network not found', 404));
        }

        res.status(200).json({
            success: true,
            data: network,
        });
    }
);

// @desc    Create network
// @route   POST /api/networks
// @access  Private/Admin
export const createNetwork = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId, name, rate, active } = req.body;

        // Validate required fields
        if (!networkId || !name || !rate) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        // Check if network already exists
        const existingNetwork = await Network.findOne({ networkId });

        if (existingNetwork) {
            return next(new ErrorResponse('Network already exists', 400));
        }

        // Create network
        const network = await Network.create({
            networkId,
            name,
            rate,
            active: active !== undefined ? active : true,
        });

        res.status(201).json({
            success: true,
            data: network,
        });
    }
);

// @desc    Update network
// @route   PUT /api/networks/:networkId
// @access  Private/Admin
export const updateNetwork = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId } = req.params;
        const { name, rate, active } = req.body;

        const network = await Network.findOne({ networkId: parseInt(networkId) });

        if (!network) {
            return next(new ErrorResponse('Network not found', 404));
        }

        // Update fields
        if (name) network.name = name;
        if (rate) network.rate = rate;
        if (active !== undefined) network.active = active;

        await network.save();

        res.status(200).json({
            success: true,
            data: network,
        });
    }
);

// @desc    Activate/Deactivate network
// @route   PUT /api/networks/:networkId/toggle
// @access  Private/Admin
export const toggleNetworkStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId } = req.params;

        const network = await Network.findOne({ networkId: parseInt(networkId) });

        if (!network) {
            return next(new ErrorResponse('Network not found', 404));
        }

        // Toggle active status
        network.active = !network.active;
        await network.save();

        res.status(200).json({
            success: true,
            data: network,
        });
    }
);

// @desc    Delete network
// @route   DELETE /api/networks/:networkId
// @access  Private/Admin
export const deleteNetwork = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId } = req.params;

        const network = await Network.findOneAndDelete({
            networkId: parseInt(networkId),
        });

        if (!network) {
            return next(new ErrorResponse('Network not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    }
);