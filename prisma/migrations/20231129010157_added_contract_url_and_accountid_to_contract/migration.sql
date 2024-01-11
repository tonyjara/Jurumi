-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "contractUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
