/*
  Warnings:

  - A unique constraint covering the columns `[moneyAccountOffsetId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "moneyAccountOffsetId" TEXT;

-- CreateTable
CREATE TABLE "MoneyAccountOffset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "wasCancelled" BOOLEAN NOT NULL DEFAULT false,
    "currency" "Currency" NOT NULL,
    "offsettedAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "moneyAccountId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "MoneyAccountOffset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_moneyAccountOffsetId_key" ON "Transaction"("moneyAccountOffsetId");

-- AddForeignKey
ALTER TABLE "MoneyAccountOffset" ADD CONSTRAINT "MoneyAccountOffset_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyAccountOffset" ADD CONSTRAINT "MoneyAccountOffset_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_moneyAccountOffsetId_fkey" FOREIGN KEY ("moneyAccountOffsetId") REFERENCES "MoneyAccountOffset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
