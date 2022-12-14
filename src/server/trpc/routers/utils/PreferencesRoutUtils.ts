import type { Account } from '@prisma/client';

export async function getSelectedOrganizationId(
  user: Omit<Account, 'password'>
) {
  return await prisma?.preferences.findUnique({
    where: { accountId: user.id },
    select: { selectedOrganization: true },
  });
}
