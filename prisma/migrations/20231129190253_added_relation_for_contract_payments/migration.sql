-- AddForeignKey
ALTER TABLE "ContractPayments" ADD CONSTRAINT "ContractPayments_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
