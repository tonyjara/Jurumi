/*
  Warnings:

  - You are about to drop the column `imbursementId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Imbursement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Imbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_imbursementId_fkey";

-- AlterTable
ALTER TABLE "Imbursement" ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "imbursementId";

-- CreateIndex
CREATE UNIQUE INDEX "Imbursement_transactionId_key" ON "Imbursement"("transactionId");

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
