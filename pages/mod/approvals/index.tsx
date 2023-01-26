import ApprovalsPage from '@/pageContainers/mod/approvals/PendingApprovalsPage.mod.approvals';
import type { GetServerSideProps } from 'next';

import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import { getSelectedOrganizationId } from '@/server/trpc/routers/utils/Preferences.routeUtils';
import prisma from '@/server/db/client';
export default ApprovalsPage;

export interface MoneyRequestsPageProps {
  moneyRequestId?: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const user = session?.user;
  if (!user)
    return {
      notFound: true,
    };
  const getPrefs = await getSelectedOrganizationId(user);
  if (!getPrefs?.selectedOrganization)
    return {
      notFound: true,
    };

  const org = await prisma?.organization.findUnique({
    where: { id: getPrefs.selectedOrganization },
    include: { moneyRequestApprovers: { select: { id: true } } },
  });

  if (!org || !org.moneyRequestApprovers.some((x) => x.id === user.id)) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
      props: {},
    };
  }
  return {
    props: {},
  };
};
