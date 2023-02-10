/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `TaxPayer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('REGULAR', 'FOUNDER', 'VIP');

-- CreateEnum
CREATE TYPE "BecomeMemberRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MEMBER';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'MEMBERSHIP_PAYMENT';

-- AlterTable
ALTER TABLE "TaxPayer" ADD COLUMN     "accountId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "membershipId" TEXT,
ADD COLUMN     "membershipPaymentRequestId" TEXT;

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "memberSince" TIMESTAMP(3) NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'PYG',
    "initialBalance" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPaymentRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "status" "MoneyRequestStatus" NOT NULL,
    "currency" "Currency" NOT NULL,
    "amountRequested" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "rejectionMessage" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "wasCancelled" BOOLEAN NOT NULL DEFAULT false,
    "paymentProofId" TEXT,
    "invoiceId" TEXT,
    "organizationId" TEXT NOT NULL,
    "moneyAccountId" TEXT,
    "membershipId" TEXT,

    CONSTRAINT "MembershipPaymentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BecomeMemberRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "fullName" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "areaOfWork" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "currentRole" TEXT NOT NULL,
    "workPhone" TEXT NOT NULL,
    "professionalReference" TEXT NOT NULL,
    "requestReason" TEXT NOT NULL,
    "howCanYouContribute" TEXT NOT NULL,
    "referenceMemberName" TEXT NOT NULL,
    "agreesToOrgTerms" BOOLEAN NOT NULL,
    "status" "BecomeMemberRequestStatus" NOT NULL,

    CONSTRAINT "BecomeMemberRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "memberSince" TIMESTAMP(3),

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_accountId_key" ON "Membership"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPaymentRequest_paymentProofId_key" ON "MembershipPaymentRequest"("paymentProofId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPaymentRequest_invoiceId_key" ON "MembershipPaymentRequest"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "BecomeMemberRequest_cedula_key" ON "BecomeMemberRequest"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "BecomeMemberRequest_email_key" ON "BecomeMemberRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_accountId_key" ON "TaxPayer"("accountId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPaymentRequest" ADD CONSTRAINT "MembershipPaymentRequest_paymentProofId_fkey" FOREIGN KEY ("paymentProofId") REFERENCES "searchableImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPaymentRequest" ADD CONSTRAINT "MembershipPaymentRequest_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "searchableImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPaymentRequest" ADD CONSTRAINT "MembershipPaymentRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPaymentRequest" ADD CONSTRAINT "MembershipPaymentRequest_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPaymentRequest" ADD CONSTRAINT "MembershipPaymentRequest_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_membershipPaymentRequestId_fkey" FOREIGN KEY ("membershipPaymentRequestId") REFERENCES "MembershipPaymentRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
