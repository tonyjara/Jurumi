-- CreateTable
CREATE TABLE "FcmNotificationTokens" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "token" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "FcmNotificationTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FcmNotificationTokens_token_key" ON "FcmNotificationTokens"("token");

-- AddForeignKey
ALTER TABLE "FcmNotificationTokens" ADD CONSTRAINT "FcmNotificationTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
