/*
  Warnings:

  - A unique constraint covering the columns `[acronym]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "acronym" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_acronym_key" ON "Project"("acronym");
