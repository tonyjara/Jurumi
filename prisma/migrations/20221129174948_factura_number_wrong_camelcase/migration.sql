/*
  Warnings:

  - You are about to drop the column `facturanumber` on the `Disbursement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taxPayerId,facturaNumber]` on the table `Disbursement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `facturaNumber` to the `Disbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Disbursement_taxPayerId_facturanumber_key";

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "facturanumber",
ADD COLUMN     "facturaNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disbursement_taxPayerId_facturaNumber_key" ON "Disbursement"("taxPayerId", "facturaNumber");
