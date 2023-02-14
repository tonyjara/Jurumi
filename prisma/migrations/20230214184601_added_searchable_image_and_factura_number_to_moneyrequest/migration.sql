/*
  Warnings:

  - A unique constraint covering the columns `[moneyRequestId]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MoneyRequest" ADD COLUMN     "facturaNumber" TEXT;

-- AlterTable
ALTER TABLE "searchableImage" ADD COLUMN     "moneyRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_moneyRequestId_key" ON "searchableImage"("moneyRequestId");

-- AddForeignKey
ALTER TABLE "searchableImage" ADD CONSTRAINT "searchableImage_moneyRequestId_fkey" FOREIGN KEY ("moneyRequestId") REFERENCES "MoneyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
