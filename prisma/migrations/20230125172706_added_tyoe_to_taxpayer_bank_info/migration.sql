-- AlterTable
ALTER TABLE "MoneyRequest" ADD COLUMN     "taxPayerId" TEXT;

-- AlterTable
ALTER TABLE "TaxPayerBankInfo" ADD COLUMN     "type" "BankAccountType" NOT NULL DEFAULT 'SAVINGS';

-- AddForeignKey
ALTER TABLE "MoneyRequest" ADD CONSTRAINT "MoneyRequest_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
