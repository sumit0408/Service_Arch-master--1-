import { ServiceManager } from "./service-manager/index";
import { Logger } from "./libs/logger/logger";
import { EnvInject } from "./services";
import WebSocketHelper from "./services/webSocketService";
import BlockDataConsumerService from "./services/blockDataService"; // Import the BlockDataConsumerService
import { connectToDatabase } from "./libs/database/db";
import { Server } from "socket.io";
import * as http from "http";

// Create an HTTP server and attach Socket.IO
const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for CORS
    }
});

// Function to initialize services
const initializeServices = async (logger: Logger) => {
    const web3ProviderUrl = "wss://sepolia.infura.io/ws/v3/23f1fb7b162842318838a1b6d1a58cce"; 
    const envInject = new EnvInject(logger);
    const socketConnectionService = new WebSocketHelper(io, web3ProviderUrl); 
    const blockDataConsumerService = new BlockDataConsumerService(); // Initialize BlockDataConsumerService
    
    // Start the BlockDataConsumerService asynchronously
    await blockDataConsumerService.start();

    return new ServiceManager(
        [envInject, socketConnectionService, blockDataConsumerService], // Initialize necessary services
        logger
    );
};

// Main function to run the server
(async () => {
    const logger = new Logger(); // Create a logger instance
    try {
        await connectToDatabase(); // Connect to the database
        const service = await initializeServices(logger); // Initialize services
        await service.run(); // Run the services
        
        // Start the HTTP server on port 3002
        httpServer.listen(3002, () => {
            // logger.log("WebSocket server is running on port 3002."); // Log the server start
        });
        
        // logger.log("All services are running."); // Log that all services are running
    } catch (error) {
        logger.error("Failed to initialize the application:", error); // Log initialization errors
        process.exit(1); // Exit the process with a failure code
    }

    // Graceful shutdown for BlockDataConsumerService on SIGINT (CTRL+C)
    process.on('SIGINT', async () => {
        logger.log('Shutting down services...');
        const blockDataConsumerService = new BlockDataConsumerService();
        await blockDataConsumerService.stop(); // Stop the consumer service
        process.exit(0);
    });
})();
