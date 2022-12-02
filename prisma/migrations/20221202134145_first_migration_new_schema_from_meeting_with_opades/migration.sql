-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "BankNamesPy" AS ENUM ('ITAU', 'BANCO_GNB', 'BANCO_CONTINENTAL', 'BANCO_ATLAS', 'BANCO_REGIONAL', 'BANCO_FAMILIAR', 'VISION_BANCO', 'BANCO_NACIONAL_DE_FOMENTO', 'SUDAMERIS', 'BANCO_BASA', 'INTERFISA_BANCO', 'BANCOP', 'BANCO_RIO', 'CITIBANK', 'BANCO_DO_BRASIL', 'BANCO_DE_LA_NACION_ARGENTINA');

-- CreateEnum
CREATE TYPE "BankDocType" AS ENUM ('CI', 'CRC', 'PASSPORT', 'RUC');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'PYG');

-- CreateEnum
CREATE TYPE "MoneyRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MoneyRequestType" AS ENUM ('FUND_REQUEST', 'MONEY_ORDER', 'REIMBURSMENT_ORDER');

-- CreateEnum
CREATE TYPE "MoneyResquestApprovalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "organizationId" TEXT,

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
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
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
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedMoneyCurrency" "Currency" NOT NULL,
    "allowedUsers" TEXT[],
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    "taxPayerId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "expectedFunds" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "projectId" TEXT,

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
    "openingBalance" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "projectId" TEXT,
    "expenseReportId" TEXT,

    CONSTRAINT "CostCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imbursement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "concept" TEXT NOT NULL,
    "wasConvertedToOtherCurrency" BOOLEAN NOT NULL DEFAULT false,
    "exchangeRate" INTEGER NOT NULL,
    "otherCurrency" "Currency" NOT NULL,
    "amountInOtherCurrency" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "finalCurrency" "Currency" NOT NULL DEFAULT 'PYG',
    "finalAmount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "moneyAccountId" TEXT NOT NULL,
    "taxPayerId" TEXT NOT NULL,
    "projectStageId" TEXT,

    CONSTRAINT "Imbursement_pkey" PRIMARY KEY ("id")
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
    "projectId" TEXT,
    "projectStageId" TEXT,

    CONSTRAINT "TaxPayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyRequestApproval" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "MoneyResquestApprovalStatus" NOT NULL,
    "rejectMessage" TEXT NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "MoneyRequestApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "description" TEXT NOT NULL,
    "status" "MoneyRequestStatus" NOT NULL,
    "moneyRequestType" "MoneyRequestType" NOT NULL,
    "currency" "Currency" NOT NULL,
    "amountRequested" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "fundSentPictureUrl" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "taxPayerId" TEXT,
    "moneyAccountId" TEXT,
    "projectId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MoneyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "facturaNumber" TEXT NOT NULL,
    "facturaPictureUrl" TEXT NOT NULL,
    "facturaText" TEXT NOT NULL,
    "amountSpent" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "taxPayerId" TEXT NOT NULL,
    "moneyRequestId" TEXT,

    CONSTRAINT "ExpenseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseReturn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "amountReturned" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "returnProofPictureUrl" TEXT NOT NULL,
    "moneyRequestId" TEXT,

    CONSTRAINT "ExpenseReturn_pkey" PRIMARY KEY ("id")
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
    "disbursementId" TEXT,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoneyAccountToOrganization" (
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
CREATE UNIQUE INDEX "BankInfo_accountNumber_key" ON "BankInfo"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_moneyAccountId_key" ON "BankInfo"("moneyAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_bankName_accountNumber_key" ON "BankInfo"("bankName", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Project_displayName_key" ON "Project"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Imbursement_concept_key" ON "Imbursement"("concept");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_razonSocial_key" ON "TaxPayer"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_ruc_key" ON "TaxPayer"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseReport_taxPayerId_facturaNumber_key" ON "ExpenseReport"("taxPayerId", "facturaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAccountToOrganization_AB_unique" ON "_MoneyAccountToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAccountToOrganization_B_index" ON "_MoneyAccountToOrganization"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankInfo" ADD CONSTRAINT "BankInfo_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCategory" ADD CONSTRAINT "CostCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCategory" ADD CONSTRAINT "CostCategory_expenseReportId_fkey" FOREIGN KEY ("expenseReportId") REFERENCES "ExpenseReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReturn" ADD CONSTRAINT "ExpenseReturn_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_disbursementId_fkey" FOREIGN KEY ("disbursementId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
