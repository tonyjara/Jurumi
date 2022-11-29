/*
  Warnings:

  - You are about to drop the column `bankId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_bankId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "bankId";
