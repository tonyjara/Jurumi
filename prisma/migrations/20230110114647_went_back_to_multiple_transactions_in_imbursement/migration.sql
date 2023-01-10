/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Imbursement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Imbursement" DROP CONSTRAINT "Imbursement_transactionId_fkey";

-- DropIndex
DROP INDEX "Imbursement_transactionId_key";

-- AlterTable
ALTER TABLE "Imbursement" DROP COLUMN "transactionId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "imbursementId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_imbursementId_fkey" FOREIGN KEY ("imbursementId") REFERENCES "Imbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
