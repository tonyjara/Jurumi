-- CreateTable
CREATE TABLE "PasswordRecoveryLinks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recoveryLink" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hasBeenUsed" BOOLEAN NOT NULL DEFAULT false,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "PasswordRecoveryLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordRecoveryLinks" ADD CONSTRAINT "PasswordRecoveryLinks_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
