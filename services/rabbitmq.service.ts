// import amqp, { Connection, Channel } from 'amqplib';
// import { Logger } from "../libs/logger/logger";
// import { LOG_MESSAGES, ERROR_MESSAGES, SERVICES } from "../constants";
// import { Service } from "../interfaces";
// import { BlockDataService } from './blockDataService';

// export class RabbitMQService implements Service {
//     serviceName: string = SERVICES.RABBITMQ; 
//     logger?: Logger;
//     isAsync: boolean = true;
//     rabbitMQChannel?: Channel; 
//     private rabbitMQConnection?: Connection; 
//     constructor(rabbitMQUrl: string, logger?: Logger) {
//         this.logger = logger;
//         if (this.logger) this.logger.setServiceName(this.serviceName);
//         this.connect(rabbitMQUrl).catch(err => {
//             console.error("Failed to connect to RabbitMQ:", err);
//         });
//     }

//     private async connect(rabbitMQUrl: string) {
//         try {
//             this.rabbitMQConnection = await amqp.connect(rabbitMQUrl);
//             this.rabbitMQChannel = await this.rabbitMQConnection.createChannel();
//             console.log('RabbitMQ Service initialized.');
//             this.logger?.log(LOG_MESSAGES.SERVICE_RUN_SUCCESS);
//         } catch (err) {
//             console.error("Failed to connect to RabbitMQ", err);
//             throw new Error("RabbitMQ connection failed");
//         }
//     }

//     async run() {
//         if (!this.rabbitMQChannel) {
//             throw new Error("RabbitMQ channel is not initialized yet.");
//         }
//         try {
//             await this.rabbitMQChannel.assertQueue('block_data', { durable: true });
//             await this.rabbitMQChannel.consume('block_data', async (msg) => {
//                 if (msg !== null) {
//                     const blockData = JSON.parse(msg.content.toString());
//                     console.log("Received Block Data: ", blockData);
//                     await this.processBlockData(blockData); 
//                     this.rabbitMQChannel?.ack(msg);
//                 }
//             });
//         } catch (err) {
//             // this.logger?.error(ERROR_MESSAGES.SERVICE_RUN_FAILED.concat('\n'), err.stack || err);
//             throw new Error(`Failed to consume block data`);
//         }
//     }

//     private async processBlockData(blockData: any) {
//         console.log("Processing Block Data: ", blockData);
//         const logger = this.logger;
//         const blockDataService = new BlockDataService(this.rabbitMQChannel, logger);
//         try {
//             await blockDataService.storeBlockData(blockData);
//             console.log("Block data stored successfully.");
//         } catch (err) {
//             console.error("Failed to store block data:", err);
//         }
//     }

//     async close() {
//         if (this.rabbitMQChannel) {
//             await this.rabbitMQChannel.close();
//         }
//         if (this.rabbitMQConnection) {
//             await this.rabbitMQConnection.close();
//         }
//     }   
// }
