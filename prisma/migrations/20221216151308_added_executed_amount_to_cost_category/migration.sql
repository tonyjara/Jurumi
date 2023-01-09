/*
  Warnings:

  - You are about to drop the column `balance` on the `CostCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CostCategory" DROP COLUMN "balance",
ADD COLUMN     "executedAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
ADD COLUMN     "openingBalance" DECIMAL(19,4) NOT NULL DEFAULT 0;
