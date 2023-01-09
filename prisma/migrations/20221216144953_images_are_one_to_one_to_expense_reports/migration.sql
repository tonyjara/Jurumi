/*
  Warnings:

  - A unique constraint covering the columns `[expenseReportId]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_expenseReportId_key" ON "searchableImage"("expenseReportId");
