/*
  Warnings:

  - You are about to drop the column `moneyAdminOrgId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `moneyApproverOrgId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Account` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_moneyAdminOrgId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_moneyApproverOrgId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_projectId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "moneyAdminOrgId",
DROP COLUMN "moneyApproverOrgId",
DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "_moneyRequestApprovers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_moneyAdministrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AccountToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_moneyRequestApprovers_AB_unique" ON "_moneyRequestApprovers"("A", "B");

-- CreateIndex
CREATE INDEX "_moneyRequestApprovers_B_index" ON "_moneyRequestApprovers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_moneyAdministrators_AB_unique" ON "_moneyAdministrators"("A", "B");

-- CreateIndex
CREATE INDEX "_moneyAdministrators_B_index" ON "_moneyAdministrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToProject_AB_unique" ON "_AccountToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToProject_B_index" ON "_AccountToProject"("B");

-- AddForeignKey
ALTER TABLE "_moneyRequestApprovers" ADD CONSTRAINT "_moneyRequestApprovers_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyRequestApprovers" ADD CONSTRAINT "_moneyRequestApprovers_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyAdministrators" ADD CONSTRAINT "_moneyAdministrators_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_moneyAdministrators" ADD CONSTRAINT "_moneyAdministrators_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToProject" ADD CONSTRAINT "_AccountToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToProject" ADD CONSTRAINT "_AccountToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
