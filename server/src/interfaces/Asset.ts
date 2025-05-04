import { Document } from 'mongoose';

export interface IAsset extends Document {
    assetId: number;
    name: string;
    description?: string;
    location?: string;
    metadata?: string;
    category: number; // Enum value
    status: number; // Enum value
    value: string;
    owner: string;
    verified: boolean;
    registrationDate: Date;
    lastUpdateDate: Date;
    createdAt: Date;
    updatedAt: Date;
}