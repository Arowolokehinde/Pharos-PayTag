import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get nonce for wallet authentication
// @route   GET /api/users/nonce/:address
// @access  Public
export const getNonce = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.params;

        if (!address || !ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid Ethereum address', 400));
        }

        // Find user by address or create new one
        let user = await User.findOne({ address: address.toLowerCase() });

        if (!user) {
            // Create new user
            user = await User.create({
                address: address.toLowerCase(),
                nonce: Math.floor(Math.random() * 1000000).toString(),
            });
        } else {
            // Update nonce
            user.nonce = Math.floor(Math.random() * 1000000).toString();
            await user.save();
        }

        res.status(200).json({
            success: true,
            nonce: user.nonce,
            message: `Please sign this message to verify your identity: ${user.nonce}`,
        });
    }
);

// @desc    Authenticate user with wallet signature
// @route   POST /api/users/auth
// @access  Public
export const authenticateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { signature, address } = req.body;

        if (!signature || !address) {
            return next(new ErrorResponse('Please provide signature and address', 400));
        }

        // Find user by address
        const user = await User.findOne({ address: address.toLowerCase() });

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Verify signature
        const message = `Please sign this message to verify your identity: ${user.nonce}`;
        const isValid = user.verifySignature(signature, message);

        if (!isValid) {
            return next(new ErrorResponse('Invalid signature', 401));
        }

        // Update last login and nonce
        user.lastLogin = new Date();
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();

        // Create token
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret, {
        //     expiresIn: process.env.JWT_EXPIRES_IN as string,
        // });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as Secret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            } as SignOptions
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                address: user.address,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
);

// src/controllers/userController.ts (continued)
export const getCurrentUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // User will be available from the auth middleware
        const user = req.user;

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                address: user.address,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
            },
        });
    }
);

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { username, email } = req.body;

        if (!req.user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Update only allowed fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                username,
                email,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: {
                id: updatedUser?._id,
                address: updatedUser?.address,
                username: updatedUser?.username,
                email: updatedUser?.email,
                role: updatedUser?.role,
            },
        });
    }
);

// @desc    Set user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const setUserRole = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { role } = req.body;
        const { id } = req.params;

        if (!['admin', 'user'].includes(role)) {
            return next(new ErrorResponse('Invalid role', 400));
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                address: user.address,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
);