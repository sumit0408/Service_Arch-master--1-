-- CreateTable
CREATE TABLE "Blocks" (
    "id" SERIAL NOT NULL,
    "blocknumber" BIGINT NOT NULL,
    "blockhash" VARCHAR(255) NOT NULL,
    "stateRoot" VARCHAR(255) NOT NULL,
    "parentHash" VARCHAR(255) NOT NULL,
    "transactionsRoot" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "transactionCount" BIGINT NOT NULL DEFAULT 0,
    "nonce" BIGINT NOT NULL,
    "miner" VARCHAR(255) NOT NULL,
    "baseFeePerGas" BIGINT NOT NULL,
    "receiptsRoot" VARCHAR(255) NOT NULL,
    "sha3Uncles" VARCHAR(255) NOT NULL,
    "transfer" TEXT NOT NULL DEFAULT '0',
    "deposit" TEXT NOT NULL DEFAULT '0',
    "size" BIGINT NOT NULL,
    "gasLimit" BIGINT NOT NULL,
    "gasUsed" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_blocknumber_key" ON "Blocks"("blocknumber");

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_blockhash_key" ON "Blocks"("blockhash");

-- CreateIndex
CREATE INDEX "Blocks_blocknumber_blockhash_idx" ON "Blocks"("blocknumber", "blockhash");

-- CreateIndex
CREATE INDEX "Blocks_createdAt_idx" ON "Blocks"("createdAt");

-- CreateIndex
CREATE INDEX "Blocks_miner_idx" ON "Blocks"("miner");
