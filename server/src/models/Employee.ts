import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../interfaces/Employee';

const EmployeeSchema: Schema = new Schema(
    {
        employeeId: {
            type: Number,
            required: [true, 'Employee ID is required'],
            // unique: true,
        },
        wallet: {
            type: String,
            required: [true, 'Wallet address is required'],
            lowercase: true,
            trim: true,
        },
        salary: {
            type: String,
            required: [true, 'Salary amount is required'],
        },
        lastPayoutTime: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
EmployeeSchema.index({ employeeId: 1 }, { unique: true });
EmployeeSchema.index({ wallet: 1 });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);