/*
  Warnings:

  - Added the required column `currency` to the `ExpenseReturn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseReturn" ADD COLUMN     "currency" "Currency" NOT NULL;
