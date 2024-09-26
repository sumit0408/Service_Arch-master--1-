import { ServiceManager } from "./service-manager/index";
import { Logger } from "./libs/logger/logger";
import { EnvInject } from "./services";
import { BlockDataService } from "./services/blockDataService";
import WebSocketHelper from "./services/webSocketService";
import { connectToDatabase } from "./libs/database/db";
import { Server } from "socket.io";
import * as http from "http";

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
    }
});

const initializeServices = async (logger: Logger) => {
    const web3ProviderUrl = "wss://sepolia.infura.io/ws/v3/23f1fb7b162842318838a1b6d1a58cce"; 
    const envInject = new EnvInject(logger);
    const socketConnectionService = new WebSocketHelper(io, web3ProviderUrl); 
    const web3Instance = socketConnectionService.web3; 
    const blockDataService = new BlockDataService(web3Instance, logger);
    return new ServiceManager(
        [envInject, socketConnectionService, blockDataService],
        logger
    );
};

(async () => {
    const logger = new Logger();
    try {
        await connectToDatabase(); 
        const service = await initializeServices(logger);
        await service.run();
        httpServer.listen(3002, () => {
            // logger.log("WebSocket server is running on port 3000.");
        });
        logger.log("All services are running.");
    } catch (error) {
        logger.error("Failed to initialize the application:", error);
        process.exit(1);
    }
})();
