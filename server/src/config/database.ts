import logger from '../utils/logger';
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONN ||
            'mongodb+srv://thesoftnode:5YWBBYLs0UM7NJtN@realpaytag.2tliat5.mongodb.net/realpaytag?retryWrites=true&w=majority&appName=realpaytag'
        );

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
};