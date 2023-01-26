-- CreateTable
CREATE TABLE "TaxPayerBankInfo" (
    "bankName" "BankNamesPy" NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerDocType" "BankDocType" NOT NULL DEFAULT 'RUC',
    "ownerDoc" TEXT NOT NULL,
    "taxPayerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayerBankInfo_accountNumber_key" ON "TaxPayerBankInfo"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayerBankInfo_taxPayerId_key" ON "TaxPayerBankInfo"("taxPayerId");

-- AddForeignKey
ALTER TABLE "TaxPayerBankInfo" ADD CONSTRAINT "TaxPayerBankInfo_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
