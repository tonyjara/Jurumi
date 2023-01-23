-- AlterTable
ALTER TABLE "ExpenseReport" ADD COLUMN     "wasCancelled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ExpenseReturn" ADD COLUMN     "wasCancelled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MoneyRequestApproval" ADD COLUMN     "wasCancelled" BOOLEAN NOT NULL DEFAULT false;
