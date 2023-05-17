/*
  Warnings:

  - Added the required column `organizationId` to the `BecomeMemberRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BecomeMemberRequest" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BecomeMemberRequest" ADD CONSTRAINT "BecomeMemberRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
