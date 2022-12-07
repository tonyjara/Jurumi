/*
  Warnings:

  - Added the required column `currency` to the `CostCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CostCategory" ADD COLUMN     "currency" "Currency" NOT NULL;
