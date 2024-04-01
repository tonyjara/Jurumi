-- DropIndex
DROP INDEX "BankInfo_accountNumber_key";

-- AlterTable
ALTER TABLE "BankInfo" ALTER COLUMN "accountNumber" DROP NOT NULL,
ALTER COLUMN "ownerName" DROP NOT NULL,
ALTER COLUMN "ownerDoc" DROP NOT NULL;
