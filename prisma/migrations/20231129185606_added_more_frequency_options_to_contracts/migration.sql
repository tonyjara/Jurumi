/*
  Warnings:

  - You are about to drop the column `paymentDay` on the `Contracts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DaysOfTheWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContractFrequency" ADD VALUE 'ONCE';
ALTER TYPE "ContractFrequency" ADD VALUE 'VARIABLE';

-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "paymentDay",
ADD COLUMN     "monthlyPaymentDay" INTEGER,
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "weeklyPaymentDay" "DaysOfTheWeek",
ADD COLUMN     "yearlyPaymentDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ContractPayments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL,
    "dateDue" TIMESTAMP(3) NOT NULL,
    "contractsId" INTEGER,
    "moneyRequestId" TEXT,

    CONSTRAINT "ContractPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractPayments" ADD CONSTRAINT "ContractPayments_contractsId_fkey" FOREIGN KEY ("contractsId") REFERENCES "Contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
