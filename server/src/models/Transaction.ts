import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces/Transaction';

const TransactionSchema: Schema = new Schema(
    {
        txHash: {
            type: String,
            required: [true, 'Transaction hash is required'],
            // unique: true,
            trim: true,
        },
        from: {
            type: String,
            required: [true, 'Sender address is required'],
            lowercase: true,
            trim: true,
        },
        to: {
            type: String,
            required: [true, 'Recipient address is required'],
            lowercase: true,
            trim: true,
        },
        amount: {
            type: String,
            required: [true, 'Amount is required'],
        },
        type: {
            type: String,
            enum: [
                'transfer',
                'mint',
                'burn',
                'payroll',
                'tagRegistration',
                'assetRegistration',
                'airtimeConversion',
                'lockWithdrawal',
            ],
            required: [true, 'Transaction type is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        blockNumber: {
            type: Number,
        },
        timestamp: {
            type: Date,
            required: [true, 'Timestamp is required'],
            default: Date.now,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
TransactionSchema.index({ txHash: 1 }, { unique: true });
TransactionSchema.index({ from: 1 });
TransactionSchema.index({ to: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ timestamp: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);