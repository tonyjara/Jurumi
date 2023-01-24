-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "searchableImageId" TEXT;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_searchableImageId_fkey" FOREIGN KEY ("searchableImageId") REFERENCES "searchableImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
