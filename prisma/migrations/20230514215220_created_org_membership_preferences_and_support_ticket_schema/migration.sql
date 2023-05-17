-- CreateTable
CREATE TABLE "OrgMembershipPreferences" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "membershipApprovalEmail" TEXT NOT NULL,
    "supportTicketsEmail" TEXT NOT NULL,
    "becomeMemberRequestReceivedMessage" TEXT NOT NULL,
    "becomeMemberRequestRejectionMessage" TEXT NOT NULL,
    "becomeMemberRequestAcceptedMessage" TEXT NOT NULL,
    "bankAccountTransferData" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "OrgMembershipPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "supportImageUrl" TEXT NOT NULL,
    "supportImageId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrgMembershipPreferences_orgId_key" ON "OrgMembershipPreferences"("orgId");

-- AddForeignKey
ALTER TABLE "OrgMembershipPreferences" ADD CONSTRAINT "OrgMembershipPreferences_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
