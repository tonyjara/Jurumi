/*
  Warnings:

  - Added the required column `offsetJustification` to the `MoneyAccountOffset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyAccountOffset" ADD COLUMN     "offsetJustification" TEXT NOT NULL;
