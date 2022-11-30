/*
  Warnings:

  - Added the required column `currency` to the `PettyCash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PettyCash" ADD COLUMN     "currency" "Currency" NOT NULL;
