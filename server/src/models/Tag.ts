import mongoose, { Schema } from 'mongoose';
import { ITag } from '../interfaces/Tag';

const TagSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Tag name is required'],
            // unique: true,
            trim: true,
        },
        owner: {
            type: String,
            required: [true, 'Owner address is required'],
            lowercase: true,
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
TagSchema.index({ name: 1 }, { unique: true });
TagSchema.index({ owner: 1 });
TagSchema.index({ address: 1 });

export default mongoose.model<ITag>('Tag', TagSchema);