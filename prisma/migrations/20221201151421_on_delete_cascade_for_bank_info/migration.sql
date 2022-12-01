-- DropForeignKey
ALTER TABLE "BankInfo" DROP CONSTRAINT "BankInfo_moneyAccountId_fkey";

-- AddForeignKey
ALTER TABLE "BankInfo" ADD CONSTRAINT "BankInfo_moneyAccountId_fkey" FOREIGN KEY ("moneyAccountId") REFERENCES "MoneyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
