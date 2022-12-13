/*
  Warnings:

  - Made the column `accountId` on table `MoneyRequestApproval` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moneyRequestId` on table `MoneyRequestApproval` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MoneyRequestApproval" DROP CONSTRAINT "MoneyRequestApproval_accountId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyRequestApproval" DROP CONSTRAINT "MoneyRequestApproval_moneyRequestId_fkey";

-- AlterTable
ALTER TABLE "MoneyRequestApproval" ALTER COLUMN "accountId" SET NOT NULL,
ALTER COLUMN "moneyRequestId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
