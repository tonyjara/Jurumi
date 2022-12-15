/*
  Warnings:

  - You are about to drop the `_CostCategoryToExpenseReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CostCategoryToExpenseReport" DROP CONSTRAINT "_CostCategoryToExpenseReport_A_fkey";

-- DropForeignKey
ALTER TABLE "_CostCategoryToExpenseReport" DROP CONSTRAINT "_CostCategoryToExpenseReport_B_fkey";

-- AlterTable
ALTER TABLE "ExpenseReport" ADD COLUMN     "costCategoryId" TEXT;

-- DropTable
DROP TABLE "_CostCategoryToExpenseReport";

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_costCategoryId_fkey" FOREIGN KEY ("costCategoryId") REFERENCES "CostCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
