/*
  Warnings:

  - You are about to drop the `ProjectStage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectStageToTaxPayer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imbursementProofId]` on the table `Imbursement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceFromOrgId]` on the table `Imbursement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('SUBSIDY', 'CONSULTING');

-- DropForeignKey
ALTER TABLE "Imbursement" DROP CONSTRAINT "Imbursement_projectStageId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" DROP CONSTRAINT "_ProjectStageToTaxPayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectStageToTaxPayer" DROP CONSTRAINT "_ProjectStageToTaxPayer_B_fkey";

-- DropForeignKey
ALTER TABLE "searchableImage" DROP CONSTRAINT "searchableImage_imbursementId_fkey";

-- AlterTable
ALTER TABLE "Imbursement" ADD COLUMN     "imbursementProofId" TEXT,
ADD COLUMN     "invoiceFromOrgId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "projectType" "ProjectType" NOT NULL DEFAULT 'SUBSIDY';

-- DropTable
DROP TABLE "ProjectStage";

-- DropTable
DROP TABLE "_ProjectStageToTaxPayer";

-- CreateIndex
CREATE UNIQUE INDEX "Imbursement_imbursementProofId_key" ON "Imbursement"("imbursementProofId");

-- CreateIndex
CREATE UNIQUE INDEX "Imbursement_invoiceFromOrgId_key" ON "Imbursement"("invoiceFromOrgId");

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_imbursementProofId_fkey" FOREIGN KEY ("imbursementProofId") REFERENCES "searchableImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_invoiceFromOrgId_fkey" FOREIGN KEY ("invoiceFromOrgId") REFERENCES "searchableImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
