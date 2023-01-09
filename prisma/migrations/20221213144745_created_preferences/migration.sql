-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "selectedOrganization" TEXT NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_accountId_key" ON "Preferences"("accountId");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
