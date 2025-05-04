import mongoose, { Schema } from 'mongoose';
import { IAsset } from '../interfaces/Asset';

const AssetSchema: Schema = new Schema(
    {
        assetId: {
            type: Number,
            required: [true, 'Asset ID is required'],
            // unique: true,
        },
        name: {
            type: String,
            required: [true, 'Asset name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        metadata: {
            type: String,
            default: '',
        },
        category: {
            type: Number,
            enum: [0, 1, 2, 3, 4], // Matches the contract enum values
            default: 4, // OTHER
        },
        status: {
            type: Number,
            enum: [0, 1, 2, 3, 4], // Matches the contract enum values
            default: 2, // PENDING_VERIFICATION
        },
        value: {
            type: String,
            required: [true, 'Asset value is required'],
        },
        owner: {
            type: String,
            required: [true, 'Owner address is required'],
            lowercase: true,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        },
        lastUpdateDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
AssetSchema.index({ assetId: 1 }, { unique: true });
AssetSchema.index({ owner: 1 });
AssetSchema.index({ verified: 1 });
AssetSchema.index({ category: 1 });
AssetSchema.index({ status: 1 });

export default mongoose.model<IAsset>('Asset', AssetSchema);