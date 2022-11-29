/*
  Warnings:

  - You are about to drop the `Disbursment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DisbursementStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DisbursementType" AS ENUM ('ADVANCE', 'MONEY_ORDER', 'REIMBURSMENT_ORDER');

-- DropForeignKey
ALTER TABLE "Disbursment" DROP CONSTRAINT "Disbursment_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursment" DROP CONSTRAINT "Disbursment_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursment" DROP CONSTRAINT "Disbursment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursment" DROP CONSTRAINT "Disbursment_taxPayerId_fkey";

-- DropTable
DROP TABLE "Disbursment";

-- DropEnum
DROP TYPE "DisbursmentStatus";

-- DropEnum
DROP TYPE "DisbursmentType";

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "status" "DisbursementStatus" NOT NULL,
    "disbursementType" "DisbursementType" NOT NULL,
    "updatedBy" TEXT,
    "accountId" TEXT NOT NULL,
    "taxPayerId" TEXT,
    "facturanumber" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "projectId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disbursement_taxPayerId_facturanumber_key" ON "Disbursement"("taxPayerId", "facturanumber");

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
