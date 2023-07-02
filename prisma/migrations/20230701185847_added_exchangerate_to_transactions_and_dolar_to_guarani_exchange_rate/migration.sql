-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "dolarToGuaraniExchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "otherCurrency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "wasConvertedToOtherCurrency" BOOLEAN NOT NULL DEFAULT false;
