/*
  Warnings:

  - A unique constraint covering the columns `[imbursementId]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expenseReturnId]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_imbursementId_key" ON "searchableImage"("imbursementId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_expenseReturnId_key" ON "searchableImage"("expenseReturnId");

-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_transactionId_key" ON "searchableImage"("transactionId");
