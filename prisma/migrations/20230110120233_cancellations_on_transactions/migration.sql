/*
  Warnings:

  - A unique constraint covering the columns `[cancellationId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "cancellationId" INTEGER,
ADD COLUMN     "isCancellation" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_cancellationId_key" ON "Transaction"("cancellationId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cancellationId_fkey" FOREIGN KEY ("cancellationId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
