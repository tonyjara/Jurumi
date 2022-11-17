/*
  Warnings:

  - Made the column `name` on table `account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" SET NOT NULL;
