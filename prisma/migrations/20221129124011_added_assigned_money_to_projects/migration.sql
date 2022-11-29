/*
  Warnings:

  - Added the required column `assignedMoneyCurrency` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "assignedMoney" DECIMAL(19,4) NOT NULL DEFAULT 0,
ADD COLUMN     "assignedMoneyCurrency" "Currency" NOT NULL;
