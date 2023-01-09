-- AlterTable
ALTER TABLE "CostCategory" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "ExpenseReport" ALTER COLUMN "amountSpent" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "ExpenseReturn" ALTER COLUMN "amountReturned" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "Imbursement" ALTER COLUMN "amountInOtherCurrency" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "finalAmount" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "MoneyRequest" ALTER COLUMN "amountRequested" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "ProjectStage" ALTER COLUMN "expectedFunds" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "openingBalance" SET DATA TYPE DECIMAL(19,4),
ALTER COLUMN "transactionAmount" SET DATA TYPE DECIMAL(19,4);
