/*
  Warnings:

  - Added the required column `currency` to the `Disbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disbursement" ADD COLUMN     "amount" DECIMAL(12,4) NOT NULL DEFAULT 0,
ADD COLUMN     "currency" "Currency" NOT NULL;
