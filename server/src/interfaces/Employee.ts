import { Document } from 'mongoose';

export interface IEmployee extends Document {
    employeeId: number;
    wallet: string;
    salary: string;
    lastPayoutTime: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}