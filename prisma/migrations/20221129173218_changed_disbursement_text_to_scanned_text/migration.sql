/*
  Warnings:

  - You are about to drop the column `text` on the `Disbursement` table. All the data in the column will be lost.
  - Added the required column `scannedText` to the `Disbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "text",
ADD COLUMN     "scannedText" TEXT NOT NULL;
