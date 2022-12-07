/*
  Warnings:

  - You are about to drop the column `disbursementId` on the `Transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_disbursementId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "disbursementId",
ADD COLUMN     "moneyRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
