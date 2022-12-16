/*
  Warnings:

  - Made the column `moneyRequestId` on table `ExpenseReport` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExpenseReport" DROP CONSTRAINT "ExpenseReport_moneyRequestId_fkey";

-- AlterTable
ALTER TABLE "ExpenseReport" ADD COLUMN     "projectId" TEXT,
ALTER COLUMN "moneyRequestId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
