/*
  Warnings:

  - Made the column `password` on table `account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "password" SET NOT NULL;
