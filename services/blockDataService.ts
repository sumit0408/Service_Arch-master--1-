import RabbitMQService from './rabbitmq.service';
import { SERVICES } from "../constants";

class BlockDataConsumerService {
    private rabbitMQService: RabbitMQService;
    public serviceName: string = SERVICES.BLOCK_DATA;
    public isAsync = true; 

    constructor() {
        this.rabbitMQService = new RabbitMQService('blockDataQueue');
    }

    async run(): Promise<void> {
        await this.start();
    }

    async start(): Promise<void> {
        try {
            await this.rabbitMQService.connect();
            await this.rabbitMQService.consume(); 
            console.log('Block data consumer service is running.');
        } catch (error) {
            console.error('Error starting the block data consumer:', error);
            throw error;
        }
    }

    async stop(): Promise<void> {
        await this.rabbitMQService.close(); 
    }
}

(async () => {
    const blockDataConsumer = new BlockDataConsumerService();

    try {
        await blockDataConsumer.start(); 
    } catch (error) {
        console.error('Failed to start the block data consumer service:', error);
        process.exit(1);
    }
    process.on('SIGINT', async () => {
        console.log('Shutting down block data consumer service...');
        await blockDataConsumer.stop();
        process.exit(0);
    });
})();

export default BlockDataConsumerService;
