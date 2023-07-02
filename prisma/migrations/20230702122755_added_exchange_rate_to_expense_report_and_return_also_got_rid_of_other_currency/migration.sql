/*
  Warnings:

  - You are about to drop the column `otherCurrency` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpenseReport" ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "wasConvertedToOtherCurrency" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ExpenseReturn" ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "wasConvertedToOtherCurrency" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "otherCurrency";
