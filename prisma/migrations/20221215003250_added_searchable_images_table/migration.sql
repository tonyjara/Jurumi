/*
  Warnings:

  - You are about to drop the column `facturaPictureUrl` on the `ExpenseReport` table. All the data in the column will be lost.
  - You are about to drop the column `returnProofPictureUrl` on the `ExpenseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `transactionProofUrl` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpenseReport" DROP COLUMN "facturaPictureUrl";

-- AlterTable
ALTER TABLE "ExpenseReturn" DROP COLUMN "returnProofPictureUrl";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionProofUrl";

-- CreateTable
CREATE TABLE "searchableImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "accountId" TEXT,
    "imbursementId" TEXT,
    "expenseReportId" TEXT,
    "expenseReturnId" TEXT,
    "transactionId" INTEGER,

    CONSTRAINT "searchableImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_imbursementId_fkey" FOREIGN KEY ("imbursementId") REFERENCES "Imbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_expenseReportId_fkey" FOREIGN KEY ("expenseReportId") REFERENCES "ExpenseReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_expenseReturnId_fkey" FOREIGN KEY ("expenseReturnId") REFERENCES "ExpenseReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
