-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_moneyAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "moneyAccountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
