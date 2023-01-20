/*
  Warnings:

  - You are about to drop the column `costCategoryId` on the `ExpenseReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExpenseReport" DROP CONSTRAINT "ExpenseReport_costCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyRequest" DROP CONSTRAINT "MoneyRequest_costCategoryId_fkey";

-- AlterTable
ALTER TABLE "ExpenseReport" DROP COLUMN "costCategoryId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "costCategoryId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_costCategoryId_fkey" FOREIGN KEY ("costCategoryId") REFERENCES "CostCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
