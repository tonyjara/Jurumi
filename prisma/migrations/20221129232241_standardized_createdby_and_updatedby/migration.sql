/*
  Warnings:

  - You are about to drop the column `createdBy` on the `MoneyTransferOperation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `MoneyTransferOperation` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `PettyCash` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `PettyCash` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `MoneyTransferOperation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `PettyCash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoneyTransferOperation" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "softDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "PettyCash" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT;
