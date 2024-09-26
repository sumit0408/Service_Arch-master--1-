import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

class RabbitMQService {
    private static instance: RabbitMQService;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queueName: string;

    constructor(queueName: string) {
        this.queueName = queueName;
    }

    public static getInstance(queueName: string): RabbitMQService {
        if (!RabbitMQService.instance) {
            RabbitMQService.instance = new RabbitMQService(queueName);
        }
        return RabbitMQService.instance;
    }

    async connect(): Promise<void> {
        if (this.connection && this.channel) {
            console.log('Already connected to RabbitMQ.');
            return;
        }

        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, { durable: true });
            console.log(`Connected to RabbitMQ and queue '${this.queueName}' is ready.`);
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

    async publish(data: any): Promise<void> {
        if (!this.channel) {
            console.error('Channel is not initialized. Call connect() first.');
            return;
        }

        try {
            const sanitizedData = JSON.parse(
                JSON.stringify(data, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
            const message = JSON.stringify(sanitizedData);
            this.channel.sendToQueue(this.queueName, Buffer.from(message), {
                persistent: true,
            });
            console.log('Message sent to RabbitMQ:', sanitizedData);
        } catch (error) {
            console.error('Error publishing message to RabbitMQ:', error);
        }
    }

    async consume(): Promise<void> {
        if (!this.channel) {
            console.error('Channel is not initialized. Call connect() first.');
            return;
        }

        try {
            await this.channel.consume(
                this.queueName,
                (msg: ConsumeMessage | null) => {
                    if (msg !== null) {
                        this.processMessage(msg);
                    }
                },
                { noAck: false } 
            );
            console.log(`Started consuming from queue '${this.queueName}'`);
        } catch (error) {
            console.error('Error starting consumer for RabbitMQ:', error);
        }
    }

    private async processMessage(msg: ConsumeMessage): Promise<void> {
        try {
            const content = JSON.parse(msg.content.toString());

            // Extract only necessary fields
            const necessaryFields = {
                number: content.number,
                hash: content.hash,
                parentHash: content.parentHash,
                nonce: content.nonce,
                sha3_uncles: content.sha3Uncles,
                logs_bloom: content.logsBloom,
                transactions_root: content.transactionsRoot,
                state_root: content.stateRoot,
                receipts_root: content.receiptsRoot,
                miner: content.miner,
                difficulty: content.difficulty,
                total_difficulty: content.totalDifficulty,
                size: content.size,
                extra_data: content.extraData,
                gas_limit: content.gasLimit,
                gas_used: content.gasUsed,
                transaction_count: content.transactionCount || 0,
            };

            console.log('Message consumed from RabbitMQ:', necessaryFields);

            this.channel?.ack(msg);
        } catch (error) {
            console.error('Error processing message:', error);
            this.channel?.nack(msg, false, false); 
        }
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                console.log('RabbitMQ channel closed.');
            }
            if (this.connection) {
                await this.connection.close();
                console.log('RabbitMQ connection closed.');
            }
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }

    setupGracefulShutdown(): void {
        process.on('SIGINT', async () => {
            console.log('Received SIGINT. Gracefully shutting down RabbitMQ connection...');
            await this.close();
            process.exit(0);
        });
    }
}

export default RabbitMQService;
