/*
  Warnings:

  - Changed the type of `cedula` on the `BecomeMemberRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BecomeMemberRequest" DROP COLUMN "cedula",
ADD COLUMN     "cedula" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BecomeMemberRequest_cedula_key" ON "BecomeMemberRequest"("cedula");
