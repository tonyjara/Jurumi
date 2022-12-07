/*
  Warnings:

  - You are about to drop the column `fundSentPictureUrl` on the `MoneyRequest` table. All the data in the column will be lost.
  - You are about to drop the column `moneyAccountId` on the `MoneyRequest` table. All the data in the column will be lost.
  - Added the required column `transactionProofUrl` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MoneyRequest" DROP CONSTRAINT "MoneyRequest_moneyAccountId_fkey";

-- AlterTable
ALTER TABLE "MoneyRequest" DROP COLUMN "fundSentPictureUrl",
DROP COLUMN "moneyAccountId";

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "transactionProofUrl" TEXT NOT NULL;
