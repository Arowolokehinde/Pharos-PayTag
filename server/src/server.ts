import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/database';
import logger from './utils/logger';
import { syncBlockchainState } from './services/blockchainSync';
import { syncHistoricEvents } from './services/blockchainHistoricSync';
import './services/blockchainListeners';

dotenv.config();


// Define port
const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Sync blockchain state
        await syncBlockchainState();

        // Sync historic events
        await syncHistoricEvents();

        // Start Express server
        app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

startServer();