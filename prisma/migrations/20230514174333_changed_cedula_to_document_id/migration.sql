/*
  Warnings:

  - You are about to drop the column `cedula` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `BecomeMemberRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BecomeMemberRequest_cedula_key";

-- AlterTable
ALTER TABLE "BecomeMemberRequest" DROP COLUMN "cedula",
ADD COLUMN     "documentId" INTEGER NOT NULL;
