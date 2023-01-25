import EditOrgModal from '@/components/Modals/org.edit.modal';
import LoadingPlantLottie from '@/components/Spinners-Loading/LoadiingPlantLottie';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormOrganization } from '@/lib/validations/org.validate';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Image,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import type {
  Organization,
  MoneyAccount,
  Transaction,
  Imbursement,
  Project,
  CostCategory,
  Account,
} from '@prisma/client';
import React, { useEffect, useState } from 'react';
import OrganizationStats from './OrgStats.mod.organization';

export type OrgForDashboard =
  | (Organization & {
      moneyAdministrators: Account[];
      moneyRequestApprovers: Account[];
      moneyAccounts: (MoneyAccount & {
        transactions: Transaction[];
      })[];
      imageLogo: {
        id: string;
        imageName: string;
        url: string;
      } | null;
      projects: (Project & {
        transactions: Transaction[];
        costCategories: (CostCategory & {
          transactions: Transaction[];
        })[];
        imbursements: (Imbursement & {
          transactions: Transaction[];
        })[];
      })[];
    })
  | null
  | undefined;

const OrganizationPage = () => {
  const [formOrg, setFormOrg] = useState<FormOrganization | null>(null);
  const backgroundColor = useColorModeValue('white', 'gray.800');
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { data: prefs, isLoading: prefsIsLoading } =
    trpcClient.preferences.getMyPreferences.useQuery();
  const { data: org, isLoading: orgIsLoading } =
    trpcClient.org.getForDashboard.useQuery(
      {
        orgId: prefs?.selectedOrganization,
      },
      { enabled: !!prefs }
    );

  useEffect(() => {
    if (!org) return;
    const formatedOrg: FormOrganization = {
      id: org.id,
      createdAt: new Date(),
      updatedAt: null,
      createdById: '',
      updatedById: null,
      displayName: org.displayName,
      archived: org.archived,
      softDeleted: org.softDeleted,
      moneyAdministrators: org.moneyAdministrators,
      moneyRequestApprovers: org.moneyRequestApprovers,
      imageLogo: org.imageLogo
        ? { url: org.imageLogo.url, imageName: org.imageLogo.imageName }
        : null,
    };
    setFormOrg(formatedOrg);
    return () => {
      setFormOrg(null);
    };
  }, [org]);

  const loading = prefsIsLoading || orgIsLoading;

  return (
    <Box display={'flex'} justifyContent="center" w="100%">
      {!loading &&
        (prefs && org ? (
          <Card
            display={'flex'}
            maxW="1200px"
            w="100%"
            backgroundColor={backgroundColor}
          >
            <Tabs overflow={'auto'}>
              <CardHeader>
                <Flex mb="10px" alignItems={'center'} gap={5}>
                  {org.imageLogo?.url && (
                    <Image
                      boxSize={{ base: '25px', md: '30px' }}
                      src={org.imageLogo.url}
                      alt="organization logo"
                    />
                  )}
                  <Text
                    fontWeight={'bold'}
                    fontSize={{ base: '2xl', md: '3xl' }}
                  >
                    {org.displayName}
                  </Text>
                  <Button onClick={onEditOpen} leftIcon={<EditIcon />}>
                    Editar
                  </Button>
                </Flex>
                <Text color={'gray.300'}>
                  Libre significa: total de las cuentas - (total asignadio a los
                  projectos - total ejecutado)
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
      {formOrg && (
        <EditOrgModal org={formOrg} isOpen={isEditOpen} onClose={onEditClose} />
      )}
    </Box>
  );
};

export default OrganizationPage;
