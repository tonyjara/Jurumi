/*
  Warnings:

  - Added the required column `paymentDate` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "remindDaysBefore" INTEGER NOT NULL DEFAULT 0;
