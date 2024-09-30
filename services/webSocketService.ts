import Web3 from 'web3';
import { SERVICES } from "../constants";
import { Server, Socket } from 'socket.io'; 
import RabbitMQService from './rabbitmq.service';

class WebSocketHelper {
    public web3: Web3;
    private io: Server; 
    private providerUrl: string;
    public serviceName: string = SERVICES.WEBSOCKET;
    isAsync: boolean = true;
    private rabbitMQService: RabbitMQService; 

    constructor(io: Server, providerUrl: string) {
        this.io = io; 
        this.providerUrl = providerUrl;
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
        this.rabbitMQService = new RabbitMQService('blockDataQueue');
        this.initializeConnection();
        this.subscribeToNewBlocks(); 
        this.rabbitMQService.connect(); 
        console.log('WebSocket server is ready to accept the connection');
    }

    initializeConnection(): void {
        this.io.on('connection', (socket: Socket) => { 
            console.log('Socket connected successfully');
        }); 
    }

    onDisconnect(): void {
        this.io.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    reconnect(): void {
        console.log('Attempting to reconnect WebSocket...');
        setTimeout(() => {
            this.web3.setProvider(new Web3.providers.WebsocketProvider(this.providerUrl));
            this.initializeConnection(); 
        }, 5000);
    }

    async subscribeToNewBlocks(): Promise<void> {
        try {
            const subscription = await this.web3.eth.subscribe('newBlockHeaders');
            

            subscription.on('data', async (blockHeader) => {
                console.log('New block header received:', blockHeader);

                try {
                    const blockData = await this.web3.eth.getBlock(blockHeader.number);
                    console.log('Full block data received:', blockData);

                    await this.rabbitMQService.publish(blockData);

                    this.io.emit('newBlock', blockData);
                } catch (blockError) {
                    // console.error('Error fetching full block data : ', blockError);
                }
            });

            subscription.on('error', (error: any) => {
                console.error('Error in block subscription:', error);
            });
        } catch (error) {
            console.error('Failed to subscribe to new block headers:', error);
        }
    }

    run(): void {
        this.initializeConnection();
        console.log('WebSocketHelper service is running.');
    }
}

export default WebSocketHelper;
