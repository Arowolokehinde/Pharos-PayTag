import { Document } from 'mongoose';

export interface ITransaction extends Document {
    txHash: string;
    from: string;
    to: string;
    amount: string;
    type: 'transfer' | 'mint' | 'burn' | 'payroll' | 'tagRegistration' | 'assetRegistration' | 'airtimeConversion' | 'lockWithdrawal';
    status: 'pending' | 'completed' | 'failed';
    blockNumber?: number;
    timestamp: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}