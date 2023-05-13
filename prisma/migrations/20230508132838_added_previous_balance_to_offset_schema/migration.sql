-- AlterTable
ALTER TABLE "MoneyAccountOffset" ADD COLUMN     "previousBalance" DECIMAL(19,4) NOT NULL DEFAULT 0;
