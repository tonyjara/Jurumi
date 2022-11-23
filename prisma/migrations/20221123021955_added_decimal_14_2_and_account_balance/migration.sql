/*
  Warnings:

  - You are about to alter the column `amount` on the `Disbursement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(12,4)`.
  - You are about to alter the column `amount` on the `Imbursement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(12,4)`.

*/
-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "balance" DECIMAL(12,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Disbursement" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,4);

-- AlterTable
ALTER TABLE "Imbursement" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,4);
