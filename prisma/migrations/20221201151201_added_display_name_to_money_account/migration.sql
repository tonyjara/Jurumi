/*
  Warnings:

  - Added the required column `displayName` to the `MoneyAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyAccount" ADD COLUMN     "displayName" TEXT NOT NULL;
