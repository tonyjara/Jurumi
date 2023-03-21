-- AlterTable
ALTER TABLE "searchableImage" ADD COLUMN     "amount" DECIMAL(19,4) NOT NULL DEFAULT 0,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'PYG';
