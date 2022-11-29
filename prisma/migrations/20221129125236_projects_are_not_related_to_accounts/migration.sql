/*
  Warnings:

  - You are about to drop the column `accountId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_accountId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "accountId";
