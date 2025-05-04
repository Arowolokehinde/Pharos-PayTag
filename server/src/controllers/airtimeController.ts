import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { ethers } from 'ethers';
import Transaction from '../models/Transaction';
import { getContracts } from '../config/web3';

// src/controllers/airtimeController.ts

// Implement the convertAirtime function
export const convertAirtime = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { networkId, amount } = req.body;

        // Validate required fields
        if (!networkId || !amount) {
            return next(new ErrorResponse('Please provide network ID and amount', 400));
        }

        try {
            // Format amount to match contract expectations (in wei)
            const amountInWei = ethers.parseEther(amount.toString());

            // Get contracts
            const contracts = getContracts();

            // Check if network is active
            const network = await contracts.airtimeConverter.getNetwork(networkId);
            if (!network.isActive) {
                return next(new ErrorResponse('Network is inactive', 400));
            }

            // Execute conversion on blockchain
            const tx = await contracts.airtimeConverter.convertAirtimeToStablecoin(
                networkId,
                amountInWei
            );

            // Wait for transaction receipt
            const receipt = await tx.wait();

            // Calculate converted amount
            const rate = ethers.formatUnits(network.rate, 2); // Assuming 2 decimals
            const convertedAmount = parseFloat(amount) * parseFloat(rate);

            // Track the transaction
            await Transaction.create({
                txHash: tx.hash,
                from: req.user?.address || tx.from,
                to: contracts.airtimeConverter.address,
                amount: convertedAmount.toString(),
                type: "airtimeConversion",
                status: "completed",
                blockNumber: receipt.blockNumber,
                timestamp: new Date(),
                metadata: {
                    networkId,
                    airtimeAmount: amount,
                    convertedAmount: convertedAmount.toString()
                },
            });

            res.status(200).json({
                success: true,
                data: {
                    networkId,
                    airtimeAmount: amount,
                    convertedAmount: convertedAmount.toString(),
                },
                transaction: tx.hash,
            });
        } catch (error: any) {
            console.error("Error converting airtime:", error);
            return next(new ErrorResponse(`Failed to convert airtime: ${error.message || "Unknown error"}`, 500));
        }
    }
);