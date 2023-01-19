-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PROJECT_IMBURSEMENT', 'COST_CATEGORY', 'MONEY_ACCOUNT');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionType" "TransactionType" NOT NULL DEFAULT 'MONEY_ACCOUNT';
