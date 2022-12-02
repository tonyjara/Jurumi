/*
  Warnings:

  - You are about to drop the column `taxPayerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `TaxPayer` table. All the data in the column will be lost.
  - You are about to drop the column `projectStageId` on the `TaxPayer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaxPayer" DROP CONSTRAINT "TaxPayer_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TaxPayer" DROP CONSTRAINT "TaxPayer_projectStageId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "taxPayerId";

-- AlterTable
ALTER TABLE "TaxPayer" DROP COLUMN "projectId",
DROP COLUMN "projectStageId";

-- CreateTable
CREATE TABLE "_ProjectToTaxPayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectStageToTaxPayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTaxPayer_AB_unique" ON "_ProjectToTaxPayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTaxPayer_B_index" ON "_ProjectToTaxPayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectStageToTaxPayer_AB_unique" ON "_ProjectStageToTaxPayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectStageToTaxPayer_B_index" ON "_ProjectStageToTaxPayer"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTaxPayer" ADD CONSTRAINT "_ProjectToTaxPayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTaxPayer" ADD CONSTRAINT "_ProjectToTaxPayer_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxPayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" ADD CONSTRAINT "_ProjectStageToTaxPayer_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" ADD CONSTRAINT "_ProjectStageToTaxPayer_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxPayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
