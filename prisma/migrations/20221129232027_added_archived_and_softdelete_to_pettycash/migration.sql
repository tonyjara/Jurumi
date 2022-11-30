-- AlterTable
ALTER TABLE "PettyCash" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "softDeleted" BOOLEAN NOT NULL DEFAULT false;
