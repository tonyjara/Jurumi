/*
  Warnings:

  - You are about to alter the column `balance` on the `BankAccount` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,4)`.

*/
-- AlterTable
ALTER TABLE "BankAccount" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,4);
