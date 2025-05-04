import mongoose, { Schema } from 'mongoose';
import { INetwork } from '../interfaces/Network';

const NetworkSchema: Schema = new Schema(
    {
        networkId: {
            type: Number,
            required: [true, 'Network ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Network name is required'],
            trim: true,
        },
        rate: {
            type: String,
            required: [true, 'Conversion rate is required'],
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

export default mongoose.model<INetwork>('Network', NetworkSchema);