/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `taxPayerId` on the `MoneyRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyRequest" DROP CONSTRAINT "MoneyRequest_taxPayerId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "MoneyRequest" DROP COLUMN "taxPayerId";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "moneyAdministrators" TEXT[],
ADD COLUMN     "moneyRequestApprovers" TEXT[];
