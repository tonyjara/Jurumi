-- AlterTable
ALTER TABLE "Imbursement" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Imbursement" ADD CONSTRAINT "Imbursement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
