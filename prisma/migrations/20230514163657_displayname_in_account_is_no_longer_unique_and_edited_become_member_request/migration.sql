/*
  Warnings:

  - You are about to drop the column `agreesToOrgTerms` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `areaOfWork` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `currentRole` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `howCanYouContribute` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `professionalReference` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `referenceMemberName` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestReason` on the `BecomeMemberRequest` table. All the data in the column will be lost.
  - You are about to drop the column `workPhone` on the `BecomeMemberRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_displayName_key";

-- AlterTable
ALTER TABLE "BecomeMemberRequest" DROP COLUMN "agreesToOrgTerms",
DROP COLUMN "areaOfWork",
DROP COLUMN "company",
DROP COLUMN "currentRole",
DROP COLUMN "howCanYouContribute",
DROP COLUMN "professionalReference",
DROP COLUMN "referenceMemberName",
DROP COLUMN "requestReason",
DROP COLUMN "workPhone";
