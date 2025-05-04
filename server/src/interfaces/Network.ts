import { Document } from 'mongoose';

export interface INetwork extends Document {
    networkId: number;
    name: string;
    rate: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}