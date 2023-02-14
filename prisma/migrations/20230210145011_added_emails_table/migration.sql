-- CreateTable
CREATE TABLE "Emails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "Emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
