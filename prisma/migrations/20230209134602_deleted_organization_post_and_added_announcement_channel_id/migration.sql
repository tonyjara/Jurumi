/*
  Warnings:

  - You are about to drop the `OrganizationPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccountToOrganizationPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationPost" DROP CONSTRAINT "OrganizationPost_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToOrganizationPost" DROP CONSTRAINT "_AccountToOrganizationPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToOrganizationPost" DROP CONSTRAINT "_AccountToOrganizationPost_B_fkey";

-- AlterTable
ALTER TABLE "OrgNotificationSettings" ADD COLUMN     "annoncementsSlackChannelId" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "OrganizationPost";

-- DropTable
DROP TABLE "_AccountToOrganizationPost";
