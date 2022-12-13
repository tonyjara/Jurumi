/*
  Warnings:

  - You are about to drop the column `allowedUsers` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `moneyAdministrators` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `moneyRequestApprovers` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `allowedUsers` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "moneyAdminOrgId" TEXT,
ADD COLUMN     "moneyApproverOrgId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "allowedUsers",
DROP COLUMN "moneyAdministrators",
DROP COLUMN "moneyRequestApprovers";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "allowedUsers";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_moneyApproverOrgId_fkey" FOREIGN KEY ("moneyApproverOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_moneyAdminOrgId_fkey" FOREIGN KEY ("moneyAdminOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
