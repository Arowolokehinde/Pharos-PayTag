import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/User';
import { ethers } from 'ethers';

const UserSchema: Schema = new Schema(
    {
        address: {
            type: String,
            required: [true, 'Address is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
            maxlength: [50, 'Username cannot be more than 50 characters'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        nonce: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Method to verify signature
UserSchema.methods.verifySignature = function (
    signature: string,
    message: string
): boolean {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === this.address.toLowerCase();
    } catch (error) {
        return false;
    }
};

export default mongoose.model<IUser>('User', UserSchema);