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
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "selectedOrganization" TEXT NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountVerificationLinks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "verificationLink" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hasBeenUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AccountVerificationLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "displayName" TEXT NOT NULL,
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
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,

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
    "expectedFunds" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "projectId" TEXT,
    "currency" "Currency" NOT NULL,
    "displayName" TEXT NOT NULL,

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
    "currency" "Currency" NOT NULL,
    "projectId" TEXT,
    "executedAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "openingBalance" DECIMAL(19,4) NOT NULL DEFAULT 0,

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
    "amountInOtherCurrency" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "finalCurrency" "Currency" NOT NULL DEFAULT 'PYG',
    "finalAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "taxPayerId" TEXT NOT NULL,
    "projectStageId" TEXT,
    "moneyAccountId" TEXT,
    "projectId" TEXT,

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

    CONSTRAINT "TaxPayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyRequestApproval" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "MoneyResquestApprovalStatus" NOT NULL,
    "rejectMessage" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "moneyRequestId" TEXT NOT NULL,

    CONSTRAINT "MoneyRequestApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "status" "MoneyRequestStatus" NOT NULL,
    "moneyRequestType" "MoneyRequestType" NOT NULL,
    "currency" "Currency" NOT NULL,
    "amountRequested" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "rejectionMessage" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "costCategoryId" TEXT,

    CONSTRAINT "MoneyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "facturaNumber" TEXT NOT NULL,
    "amountSpent" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "taxPayerId" TEXT NOT NULL,
    "moneyRequestId" TEXT NOT NULL,
    "costCategoryId" TEXT,
    "projectId" TEXT,
    "currency" "Currency" NOT NULL,
    "comments" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "ExpenseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseReturn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "amountReturned" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "moneyRequestId" TEXT NOT NULL,

    CONSTRAINT "ExpenseReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedById" TEXT,
    "currency" "Currency" NOT NULL,
    "openingBalance" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "transactionAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "moneyAccountId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "moneyRequestId" TEXT,
    "expenseReturnId" TEXT,
    "imbursementId" TEXT,
    "cancellationId" INTEGER,
    "isCancellation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "searchableImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "accountId" TEXT,
    "imbursementId" TEXT,
    "expenseReportId" TEXT,
    "expenseReturnId" TEXT,
    "transactionId" INTEGER,

    CONSTRAINT "searchableImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_moneyAdministrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_moneyRequestApprovers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MoneyAccountToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToTaxPayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectStageToTaxPayer" (
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
CREATE UNIQUE INDEX "Preferences_accountId_key" ON "Preferences"("accountId");

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
CREATE UNIQUE INDEX "Transaction_cancellationId_key" ON "Transaction"("cancellationId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_imbursementId_key" ON "searchableImage"("imbursementId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_expenseReportId_key" ON "searchableImage"("expenseReportId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_expenseReturnId_key" ON "searchableImage"("expenseReturnId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_transactionId_key" ON "searchableImage"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToProject_AB_unique" ON "_AccountToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToProject_B_index" ON "_AccountToProject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_moneyAdministrators_AB_unique" ON "_moneyAdministrators"("A", "B");

-- CreateIndex
CREATE INDEX "_moneyAdministrators_B_index" ON "_moneyAdministrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_moneyRequestApprovers_AB_unique" ON "_moneyRequestApprovers"("A", "B");

-- CreateIndex
CREATE INDEX "_moneyRequestApprovers_B_index" ON "_moneyRequestApprovers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAccountToOrganization_AB_unique" ON "_MoneyAccountToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAccountToOrganization_B_index" ON "_MoneyAccountToOrganization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTaxPayer_AB_unique" ON "_ProjectToTaxPayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTaxPayer_B_index" ON "_ProjectToTaxPayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectStageToTaxPayer_AB_unique" ON "_ProjectStageToTaxPayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectStageToTaxPayer_B_index" ON "_ProjectStageToTaxPayer"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountVerificationLinks" ADD CONSTRAINT "AccountVerificationLinks_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankInfo" ADD CONSTRAINT "BankInfo_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCategory" ADD CONSTRAINT "CostCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequestApproval" ADD CONSTRAINT "MoneyRequestApproval_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_costCategoryId_fkey" FOREIGN KEY ("costCategoryId") REFERENCES "CostCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_costCategoryId_fkey" FOREIGN KEY ("costCategoryId") REFERENCES "CostCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReport" ADD CONSTRAINT "ExpenseReport_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseReturn" ADD CONSTRAINT "ExpenseReturn_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cancellationId_fkey" FOREIGN KEY ("cancellationId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_expenseReturnId_fkey" FOREIGN KEY ("expenseReturnId") REFERENCES "ExpenseReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_imbursementId_fkey" FOREIGN KEY ("imbursementId") REFERENCES "Imbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_expenseReportId_fkey" FOREIGN KEY ("expenseReportId") REFERENCES "ExpenseReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_expenseReturnId_fkey" FOREIGN KEY ("expenseReturnId") REFERENCES "ExpenseReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_imbursementId_fkey" FOREIGN KEY ("imbursementId") REFERENCES "Imbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToProject" ADD CONSTRAINT "_AccountToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToProject" ADD CONSTRAINT "_AccountToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyAdministrators" ADD CONSTRAINT "_moneyAdministrators_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyAdministrators" ADD CONSTRAINT "_moneyAdministrators_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyRequestApprovers" ADD CONSTRAINT "_moneyRequestApprovers_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyRequestApprovers" ADD CONSTRAINT "_moneyRequestApprovers_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAccountToOrganization" ADD CONSTRAINT "_MoneyAccountToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTaxPayer" ADD CONSTRAINT "_ProjectToTaxPayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTaxPayer" ADD CONSTRAINT "_ProjectToTaxPayer_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxPayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" ADD CONSTRAINT "_ProjectStageToTaxPayer_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" ADD CONSTRAINT "_ProjectStageToTaxPayer_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxPayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
