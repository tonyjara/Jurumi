/*
  Warnings:

  - You are about to drop the column `pettyCashId` on the `Disbursement` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `Imbursement` table. All the data in the column will be lost.
  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoneyTransferOperation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PettyCash` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BankAccountToOrganization` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `moneyAccountId` to the `Imbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_pettyCashId_fkey";

-- DropForeignKey
ALTER TABLE "Imbursement" DROP CONSTRAINT "Imbursement_bankId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyTransferOperation" DROP CONSTRAINT "MoneyTransferOperation_bankFromId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyTransferOperation" DROP CONSTRAINT "MoneyTransferOperation_bankToId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyTransferOperation" DROP CONSTRAINT "MoneyTransferOperation_pettyCashToId_fkey";

-- DropForeignKey
ALTER TABLE "_BankAccountToOrganization" DROP CONSTRAINT "_BankAccountToOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_BankAccountToOrganization" DROP CONSTRAINT "_BankAccountToOrganization_B_fkey";

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "pettyCashId";

-- AlterTable
ALTER TABLE "Imbursement" DROP COLUMN "bankId",
ADD COLUMN     "moneyAccountId" TEXT NOT NULL;

-- DropTable
DROP TABLE "BankAccount";

-- DropTable
DROP TABLE "MoneyTransferOperation";

-- DropTable
DROP TABLE "PettyCash";

-- DropTable
DROP TABLE "_BankAccountToOrganization";

-- CreateTable
CREATE TABLE "MoneyAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "isCashAccount" BOOLEAN NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'PYG',
    "initialBalance" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MoneyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankInfo" (
    "bankName" "BankNamesPy" NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerDocType" "BankDocType" NOT NULL DEFAULT 'RUC',
    "ownerDoc" TEXT NOT NULL,
    "ownerContactNumber" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'SAVINGS',
    "moneyAccountId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "currency" "Currency" NOT NULL,
    "openingBalance" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "transactionAmount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "moneyAccountId" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoneyAccountToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_accountNumber_key" ON "BankInfo"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_moneyAccountId_key" ON "BankInfo"("moneyAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_bankName_accountNumber_key" ON "BankInfo"("bankName", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAccountToOrganization_AB_unique" ON "_MoneyAccountToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAccountToOrganization_B_index" ON "_MoneyAccountToOrganization"("B");

-- AddForeignKey
ALTER TABLE "BankInfo" ADD CONSTRAINT "BankInfo_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
