/*
  Warnings:

  - You are about to drop the column `displayName` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `owner_ci` on the `BankAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountNumber` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BankNamesPy" AS ENUM ('ITAU', 'BANCO_GNB', 'BANCO_CONTINENTAL', 'BANCO_ATLAS', 'BANCO_REGIONAL', 'BANCO_FAMILIAR', 'VISION_BANCO', 'BANCO_NACIONAL_DE_FOMENTO', 'SUDAMERIS', 'BANCO_BASA', 'INTERFISA_BANCO', 'BANCOP', 'BANCO_RIO', 'CITIBANK', 'BANCO_DO_BRASIL', 'BANCO_DE_LA_NACION_ARGENTINA');

-- CreateEnum
CREATE TYPE "BankDocType" AS ENUM ('CI', 'CRC', 'PASSPORT', 'RUC');

-- DropIndex
DROP INDEX "BankAccount_displayName_key";

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "displayName",
DROP COLUMN "owner",
DROP COLUMN "owner_ci",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "bankName" "BankNamesPy" NOT NULL,
ADD COLUMN     "ownerContactNumber" TEXT,
ADD COLUMN     "ownerDocType" "BankDocType" NOT NULL DEFAULT 'RUC',
ADD COLUMN     "ownerName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");
