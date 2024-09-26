import { prisma } from '../libs/database/db';  
import { Logger } from "../libs/logger/logger";
import { SERVICES, LOG_MESSAGES, ERROR_MESSAGES } from "../constants";
import Web3 from 'web3';

export class BlockDataService {
    serviceName: string = SERVICES.BLOCK_DATA;
    logger?: Logger;
    web3: Web3;
    isAsync: boolean = true;
    latestBlockNumber: number | null = null; 
    constructor(web3Instance: Web3, logger?: Logger) {
        this.web3 = web3Instance;
        this.logger = logger;
        if (this.logger) this.logger.setServiceName(this.serviceName);
    }
        
    private convertBigIntToNumber(block: any) {
        block.number = Number(block.number); 
        block.gasLimit = Number(block.gasLimit); 
        block.gasUsed = Number(block.gasUsed); 
        block.difficulty = Number(block.difficulty); 
        block.totalDifficulty = Number(block.totalDifficulty); 
        block.size = Number(block.size); 
        block.baseFeePerGas = Number(block.baseFeePerGas || 0); 
        block.timestamp = Number(block.timestamp); 
    
        if (block.transactions) {
            block.transactions.forEach((tx: any) => {
                tx.blockNumber = Number(tx.blockNumber); 
                tx.chainId = Number(tx.chainId); 
                tx.nonce = Number(tx.nonce); 
            });
        }
        return block;
    }
    logBlockData(blockData: any) {
        const blockDataSerializable = JSON.parse(JSON.stringify(blockData, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value
        ));
        console.log('Block Data: ***', JSON.stringify(blockDataSerializable, null, 2));
    }
    async subscribeToNewBlocks() {
        try {
            console.log("Subscribing to new block headers...");
            
            const latestBlock = await this.web3.eth.getBlock('latest', true);
            this.logBlockData(this.convertBigIntToNumber(latestBlock)); 
    
            this.web3.eth.subscribe('newBlockHeaders', async (error: any, blockHeader: any) => {
                if (error) {
                    console.error('Error subscribing to new blocks:', error);
                    return;
                }
    
                console.log('New block header received:', blockHeader);
                
                try {

                    const blockData = await this.web3.eth.getBlock(blockHeader.number, true);
    
                    if (blockData && blockData.number !== latestBlock.number) {
                        this.logBlockData(this.convertBigIntToNumber(blockData));
                        latestBlock.number = blockData.number; 
                    }
                } catch (err) {
                    console.error('Error fetching block data:', err);
                }
            });
        } catch (err) {
            this.logger?.error(ERROR_MESSAGES.BLOCK_FETCH_FAILED.concat('\n'), err);
            throw new Error('Failed to subscribe to new block headers');
        }
    }
    async run() {
        try {
            console.log("BlockDataService is running...");
            await this.subscribeToNewBlocks();  
        } catch (err) {
            throw err;
        }
    }
}
