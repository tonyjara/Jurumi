/*
  Warnings:

  - You are about to drop the column `createdById` on the `Imbursement` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Imbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Imbursement" DROP COLUMN "createdById",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
