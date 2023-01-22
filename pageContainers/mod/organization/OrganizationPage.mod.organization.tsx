import LoadingPlantLottie from '@/components/Spinners-Loading/LoadiingPlantLottie';
import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type {
  Organization,
  MoneyAccount,
  Transaction,
  Imbursement,
  Project,
  CostCategory,
} from '@prisma/client';
import React from 'react';
import OrganizationStats from './OrgStats.mod.organization';

export type OrgForDashboard = Organization & {
  moneyAccounts: (MoneyAccount & {
    transactions: Transaction[];
  })[];
  projects: (Project & {
    transactions: Transaction[];
    costCategories: (CostCategory & {
      transactions: Transaction[];
    })[];
    imbursements: (Imbursement & {
      transactions: Transaction[];
    })[];
  })[];
};
const OrganizationPage = () => {
  const backgroundColor = useColorModeValue('white', 'gray.800');

  const { data: prefs, isLoading: prefsIsLoading } =
    trpcClient.preferences.getMyPreferences.useQuery();
  const { data: org, isLoading: orgIsLoading } =
    trpcClient.org.getForDashboard.useQuery(
      {
        orgId: prefs?.selectedOrganization,
      },
      { enabled: !!prefs }
    );
  const loading = prefsIsLoading || orgIsLoading;
  return (
    <>
      {!loading &&
        (prefs && org ? (
          <Card backgroundColor={backgroundColor}>
            <Tabs overflow={'auto'}>
              <CardHeader>
                <Text fontWeight={'bold'} fontSize={'3xl'}>
                  {org.displayName}
                </Text>
              </CardHeader>
              <CardBody>
                <OrganizationStats org={org} />
              </CardBody>
            </Tabs>
          </Card>
        ) : (
          <div>
            <Text fontSize={'xl'}>Favor seleccione una organización</Text>
          </div>
        ))}
      {loading && <LoadingPlantLottie />}
    </>
  );
};

export default OrganizationPage;
