/*
  Warnings:

  - You are about to drop the column `createdById` on the `MoneyRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `MoneyRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoneyRequest" DROP COLUMN "createdById",
DROP COLUMN "updatedById";

-- AlterTable
ALTER TABLE "MoneyRequestApproval" ADD COLUMN     "moneyRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
