/*
  Warnings:

  - You are about to drop the column `category` on the `Contracts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "category",
ADD COLUMN     "contratCategoriesId" INTEGER;

-- CreateTable
CREATE TABLE "ContratCategories" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "ContratCategories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_contratCategoriesId_fkey" FOREIGN KEY ("contratCategoriesId") REFERENCES "ContratCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
