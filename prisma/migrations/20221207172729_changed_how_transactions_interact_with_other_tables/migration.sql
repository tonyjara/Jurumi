/*
  Warnings:

  - Made the column `moneyRequestId` on table `ExpenseReturn` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExpenseReturn" DROP CONSTRAINT "ExpenseReturn_moneyRequestId_fkey";

-- DropForeignKey
ALTER TABLE "Imbursement" DROP CONSTRAINT "Imbursement_moneyAccountId_fkey";

-- AlterTable
ALTER TABLE "ExpenseReturn" ALTER COLUMN "moneyRequestId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Imbursement" ALTER COLUMN "moneyAccountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "expenseReturnId" TEXT,
ADD COLUMN     "imbursementId" TEXT;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReturn" ADD CONSTRAINT "ExpenseReturn_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_expenseReturnId_fkey" FOREIGN KEY ("expenseReturnId") REFERENCES "ExpenseReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_imbursementId_fkey" FOREIGN KEY ("imbursementId") REFERENCES "Imbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
