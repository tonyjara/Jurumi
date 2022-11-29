/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Disbursement` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Disbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_bankId_fkey";

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "pettyCashId" TEXT,
ALTER COLUMN "bankId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_pettyCashId_fkey" FOREIGN KEY ("pettyCashId") REFERENCES "PettyCash"("id") ON DELETE SET NULL ON UPDATE CASCADE;
