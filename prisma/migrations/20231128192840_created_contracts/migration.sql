-- CreateEnum
CREATE TYPE "ContractFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "MoneyRequest" ADD COLUMN     "contractsId" INTEGER;

-- CreateTable
CREATE TABLE "Contracts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "wasCancelledAt" TIMESTAMP(3),
    "frequency" "ContractFrequency" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL,
    "moneyRequestType" "MoneyRequestType" NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "wasCancelled" BOOLEAN NOT NULL DEFAULT false,
    "wasFinalized" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "costCategoryId" TEXT,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_contractsId_fkey" FOREIGN KEY ("contractsId") REFERENCES "Contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_costCategoryId_fkey" FOREIGN KEY ("costCategoryId") REFERENCES "CostCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
