/*
  Warnings:

  - Added the required column `currency` to the `ProjectStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `ProjectStage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectStage" ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "displayName" TEXT NOT NULL;
