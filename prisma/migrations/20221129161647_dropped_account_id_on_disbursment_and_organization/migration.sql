/*
  Warnings:

  - You are about to drop the column `accountId` on the `Disbursement` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_accountId_fkey";

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "accountId";
