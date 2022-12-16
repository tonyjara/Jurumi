/*
  Warnings:

  - Added the required column `comments` to the `ExpenseReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseReport" ADD COLUMN     "comments" TEXT NOT NULL;
