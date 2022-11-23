-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'PYG');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "avatarUrl" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'SAVINGS',
    "currency" "Currency" NOT NULL DEFAULT 'PYG',
    "owner" TEXT NOT NULL,
    "owner_ci" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imbursement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "concept" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'PYG',
    "amount" BIGINT NOT NULL,
    "bankId" TEXT NOT NULL,
    "taxPayerId" TEXT NOT NULL,
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Imbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "concept" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'PYG',
    "amount" BIGINT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "fantasyName" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaxPayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "updatedBy" TEXT,
    "accountId" TEXT NOT NULL,
    "taxPayerId" TEXT,
    "facturanumber" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "projectId" TEXT,
    "disbursementId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BankAccountToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_displayName_key" ON "Account"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_accountId_key" ON "Profile"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_displayName_key" ON "Organization"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_displayName_key" ON "BankAccount"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Project_displayName_key" ON "Project"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Imbursement_concept_key" ON "Imbursement"("concept");

-- CreateIndex
CREATE UNIQUE INDEX "Disbursement_concept_key" ON "Disbursement"("concept");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_razonSocial_key" ON "TaxPayer"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_ruc_key" ON "TaxPayer"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_taxPayerId_facturanumber_key" ON "Transaction"("taxPayerId", "facturanumber");

-- CreateIndex
CREATE UNIQUE INDEX "_BankAccountToOrganization_AB_unique" ON "_BankAccountToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_BankAccountToOrganization_B_index" ON "_BankAccountToOrganization"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_disbursementId_fkey" FOREIGN KEY ("disbursementId") REFERENCES "Disbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BankAccountToOrganization" ADD CONSTRAINT "_BankAccountToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BankAccountToOrganization" ADD CONSTRAINT "_BankAccountToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
