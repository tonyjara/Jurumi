-- CreateTable
CREATE TABLE "OrganizationPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToOrganizationPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToOrganizationPost_AB_unique" ON "_AccountToOrganizationPost"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToOrganizationPost_B_index" ON "_AccountToOrganizationPost"("B");

-- AddForeignKey
ALTER TABLE "OrganizationPost" ADD CONSTRAINT "OrganizationPost_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToOrganizationPost" ADD CONSTRAINT "_AccountToOrganizationPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToOrganizationPost" ADD CONSTRAINT "_AccountToOrganizationPost_B_fkey" FOREIGN KEY ("B") REFERENCES "OrganizationPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
