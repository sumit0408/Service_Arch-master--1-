-- CreateTable
CREATE TABLE "Blocks" (
    "id" SERIAL NOT NULL,
    "blocknumber" INTEGER NOT NULL,
    "blockhash" VARCHAR(255) NOT NULL,
    "parentHash" VARCHAR(255) NOT NULL,
    "nonce" INTEGER NOT NULL,
    "sha3Uncles" VARCHAR(255) NOT NULL,
    "transactionsRoot" VARCHAR(255) NOT NULL,
    "stateRoot" VARCHAR(255) NOT NULL,
    "receiptsRoot" VARCHAR(255) NOT NULL,
    "miner" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "gasLimit" BIGINT NOT NULL,
    "gasUsed" BIGINT NOT NULL,
    "transactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_block_number_key" ON "Blocks"("blocknumber");

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_blockhash_key" ON "Blocks"("blockhash");

-- CreateIndex
CREATE INDEX "Blocks_block_number_blockhash_idx" ON "Blocks"("blocknumber", "blockhash");

-- CreateIndex
CREATE INDEX "Blocks_created_at_idx" ON "Blocks"("createdAt");

-- CreateIndex
CREATE INDEX "Blocks_miner_idx" ON "Blocks"("miner");
