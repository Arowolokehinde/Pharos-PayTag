import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User from '../models/User';
import { IUser } from '../interfaces/User';
import { ErrorResponse } from '../utils/errorResponse';

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// Protect routes - JWT authentication
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if (!token) {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
                id: string;
            };

            // Get user from the token
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new ErrorResponse('User not found', 404));
            }

            // Add user to request
            req.user = user;
            next();
        } catch (error) {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }
    } catch (error) {
        next(error);
    }
};

// Web3 signature verification middleware
export const verifySignature = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { signature, message, address } = req.body;

        if (!signature || !message || !address) {
            return next(
                new ErrorResponse('Signature, message, and address are required', 400)
            );
        }

        try {
            // Recover address from signature
            const recoveredAddress = ethers.verifyMessage(message, signature);

            // Check if recovered address matches provided address
            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                return next(new ErrorResponse('Invalid signature', 401));
            }

            // Find or create user
            let user = await User.findOne({ address: address.toLowerCase() });

            if (!user) {
                // Create new user if not found
                user = await User.create({
                    address: address.toLowerCase(),
                    nonce: Math.floor(Math.random() * 1000000).toString(),
                });
            } else {
                // Update nonce for security
                user.nonce = Math.floor(Math.random() * 1000000).toString();
                await user.save();
            }

            // Add user to request
            req.user = user;
            next();
        } catch (error) {
            return next(new ErrorResponse('Invalid signature', 401));
        }
    } catch (error) {
        next(error);
    }
};

// Admin authorization middleware
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};