/*
  Warnings:

  - Added the required column `email` to the `AccountVerificationLinks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountVerificationLinks" ADD COLUMN     "email" TEXT NOT NULL;
