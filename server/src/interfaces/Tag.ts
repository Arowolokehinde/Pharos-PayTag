import { Document } from 'mongoose';

export interface ITag extends Document {
    name: string;
    owner: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}