import { Document } from 'mongoose';

export interface IUser extends Document {
    address: string;
    username?: string;
    email?: string;
    role: 'admin' | 'user';
    isActive: boolean;
    nonce: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Methods
    verifySignature(signature: string, message: string): boolean;
}