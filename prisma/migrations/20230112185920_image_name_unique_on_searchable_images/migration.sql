/*
  Warnings:

  - A unique constraint covering the columns `[imageName]` on the table `searchableImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "searchableImage_imageName_key" ON "searchableImage"("imageName");
