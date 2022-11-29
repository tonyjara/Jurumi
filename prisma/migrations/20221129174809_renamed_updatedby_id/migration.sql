/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `Disbursement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "updatedBy",
ADD COLUMN     "updatedById" TEXT;
