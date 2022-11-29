/*
  Warnings:

  - You are about to drop the column `disbursementId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Disbursement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ADVANCE', 'MONEY_ORDER', 'REIMBURSMENT_ORDER');

-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_disbursementId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "disbursementId",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;

-- DropTable
DROP TABLE "Disbursement";

-- CreateTable
CREATE TABLE "MoneyTransferOperation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "fromCurrency" "Currency" NOT NULL,
    "fromAmount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "toCurrency" "Currency" NOT NULL,
    "toAmount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "echangeRate" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "bankFromId" TEXT NOT NULL,
    "bankToId" TEXT,
    "pettyCashToId" TEXT,

    CONSTRAINT "MoneyTransferOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PettyCash" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "displayName" TEXT NOT NULL,
    "amount" DECIMAL(12,4) NOT NULL DEFAULT 0,

    CONSTRAINT "PettyCash_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoneyTransferOperation" ADD CONSTRAINT "MoneyTransferOperation_bankFromId_fkey" FOREIGN KEY ("bankFromId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyTransferOperation" ADD CONSTRAINT "MoneyTransferOperation_bankToId_fkey" FOREIGN KEY ("bankToId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyTransferOperation" ADD CONSTRAINT "MoneyTransferOperation_pettyCashToId_fkey" FOREIGN KEY ("pettyCashToId") REFERENCES "PettyCash"("id") ON DELETE SET NULL ON UPDATE CASCADE;
