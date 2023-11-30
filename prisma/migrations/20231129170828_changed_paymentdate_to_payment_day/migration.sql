/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Contracts` table. All the data in the column will be lost.
  - Added the required column `paymentDay` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "paymentDate",
ADD COLUMN     "paymentDay" INTEGER NOT NULL;
