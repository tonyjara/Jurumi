/*
  Warnings:

  - Added the required column `moneyAccountId` to the `ExpenseReturn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseReturn" ADD COLUMN     "moneyAccountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExpenseReturn" ADD CONSTRAINT "ExpenseReturn_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
