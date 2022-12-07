/*
  Warnings:

  - Added the required column `rejectionMessage` to the `MoneyRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyRequest" ADD COLUMN     "rejectionMessage" TEXT NOT NULL;
