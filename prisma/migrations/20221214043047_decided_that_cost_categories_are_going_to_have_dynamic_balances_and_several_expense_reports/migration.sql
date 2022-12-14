/*
  Warnings:

  - You are about to drop the column `expenseReportId` on the `CostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `openingBalance` on the `CostCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CostCategory" DROP CONSTRAINT "CostCategory_expenseReportId_fkey";

-- AlterTable
ALTER TABLE "CostCategory" DROP COLUMN "expenseReportId",
DROP COLUMN "openingBalance",
ADD COLUMN     "balance" DECIMAL(12,4) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_CostCategoryToExpenseReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CostCategoryToExpenseReport_AB_unique" ON "_CostCategoryToExpenseReport"("A", "B");

-- CreateIndex
CREATE INDEX "_CostCategoryToExpenseReport_B_index" ON "_CostCategoryToExpenseReport"("B");

-- AddForeignKey
ALTER TABLE "_CostCategoryToExpenseReport" ADD CONSTRAINT "_CostCategoryToExpenseReport_A_fkey" FOREIGN KEY ("A") REFERENCES "CostCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostCategoryToExpenseReport" ADD CONSTRAINT "_CostCategoryToExpenseReport_B_fkey" FOREIGN KEY ("B") REFERENCES "ExpenseReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
