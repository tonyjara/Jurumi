import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import type { MoneyRequestComplete } from '@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests';
import {
  Box,
  Flex,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import type { MoneyRequest } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import React from 'react';

const FundRequestPrintPage = ({
  moneyRequest,
}: {
  moneyRequest: MoneyRequestComplete | null;
}) => {
  const { data: org } = trpcClient.org.getCurrent.useQuery();
  const user = useSession().data?.user;
  const borderColor = useColorModeValue('gray.700', 'gray.300');

  const fakeRequest: MoneyRequestComplete = {
    id: 'cldagi67k005qpftt2ssd67m9',
    createdAt: new Date(),
    updatedAt: null,
    description:
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    status: 'ACCEPTED',
    moneyRequestType: 'FUND_REQUEST',
    currency: 'PYG',
    amountRequested: new Prisma.Decimal(1681068),
    rejectionMessage: '',
    archived: false,
    softDeleted: false,
    wasCancelled: false,
    accountId: 'clcqw3zaq0006pf5svlfa1iwg',
    organizationId: 'clcqw4lz10008pf5s711y5uwx',
    projectId: 'cld1pg5wb0004pfe9w9bnpdn9',
    account: {
      id: 'clcqw3zaq0006pf5svlfa1iwg',
      active: true,
      createdAt: new Date(),
      updatedAt: null,
      email: 'tony@tony.com',
      displayName: 'Tony local',
      password: '$2a$10$kapySv/YYSdmo4xVMaKKqOu.yXj2LYdCpxPTaP58JevfN.lYRPfNm',
      role: 'ADMIN',
      isVerified: true,
    },
    project: {
      id: 'cld1pg5wb0004pfe9w9bnpdn9',
      createdAt: new Date(),
      updatedAt: null,
      createdById: 'clcqw3zaq0006pf5svlfa1iwg',
      endDate: null,
      updatedById: 'clcqw3zaq0006pf5svlfa1iwg',
      displayName: 'Pavap',
      description: 'Programa de apoyo a voluntarios',
      financerName: 'Arturo',
      archived: false,
      softDeleted: false,
      projectType: 'SUBSIDY',
      organizationId: 'clcqw4lz10008pf5s711y5uwx',
    },
    transactions: [
      {
        id: 116,
        createdAt: new Date(),
        updatedAt: null,
        updatedById: null,
        currency: 'PYG',
        openingBalance: new Prisma.Decimal(10000000),
        currentBalance: new Prisma.Decimal(8318932),
        transactionAmount: new Prisma.Decimal(1681068),
        isCancellation: false,
        transactionType: 'MONEY_ACCOUNT',
        cancellationId: null,
        accountId: 'clcqw3zaq0006pf5svlfa1iwg',
        expenseReturnId: null,
        imbursementId: null,
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
      },
      {
        id: 118,
        createdAt: new Date(),
        updatedAt: null,
        updatedById: null,
        currency: 'PYG',
        openingBalance: new Prisma.Decimal(8318932),
        currentBalance: new Prisma.Decimal(9159466),
        transactionAmount: new Prisma.Decimal(840534),
        isCancellation: false,
        transactionType: 'EXPENSE_RETURN',
        cancellationId: null,
        accountId: 'clcqw3zaq0006pf5svlfa1iwg',
        expenseReturnId: 'cldagi6870061pftttzyth6sn',
        imbursementId: null,
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
      },
    ],
    moneyRequestApprovals: [],
    expenseReports: [
      {
        id: 'cldagi67y005xpfttj4my35rs',
        createdAt: new Date(),
        updatedAt: null,
        facturaNumber: '9720455630179',
        amountSpent: new Prisma.Decimal(840534),
        currency: 'PYG',
        comments:
          'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
        wasCancelled: false,
        accountId: 'clcqw3zaq0006pf5svlfa1iwg',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: 'cld1pg5wb0004pfe9w9bnpdn9',
        taxPayerId: 'cldagi67u005spftt9pqkq3y6',
        costCategoryId: 'cld1pg5wc0005pfe9qkxt5amm',
      },
    ],
    expenseReturns: [
      {
        id: 'cldagi6870061pftttzyth6sn',
        createdAt: new Date(),
        updatedAt: null,
        wasCancelled: false,
        currency: 'PYG',
        amountReturned: new Prisma.Decimal(840534),
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        accountId: 'clcqw3zaq0006pf5svlfa1iwg',
      },
    ],
    organization: {
      moneyRequestApprovers: [],
      moneyAdministrators: [],
    },
  };

  const req = moneyRequest ?? fakeRequest;
  return (
    <Box ml="40px" mt={'40px'}>
      <Flex gap={5}>
        {org?.imageLogo?.url && (
          <Image
            boxSize={'80px'}
            src={org?.imageLogo.url}
            alt="organization logo"
          />
        )}
        <Text fontSize={'6xl'}>{org?.displayName}</Text>
      </Flex>
      <Text fontSize={'2xl'}>SOLICITUD DE ANTICIPO</Text>
      <TableContainer
        borderColor={borderColor}
        borderWidth="1px"
        borderStyle={'solid'}
        borderRadius="8px"
        maxW="800px"
        mt={'20px'}
      >
        <Table colorScheme={borderColor}>
          <Tbody>
            <Tr>
              <Td fontWeight={'bold'}>Responsable:</Td>
              <Td>{req.account.displayName}</Td>
            </Tr>
            <Tr>
              <Td fontWeight={'bold'}>Fecha:</Td>
              <Td>{format(req.createdAt, 'dd/MM/yy hh:mm')}</Td>
            </Tr>
            <Tr>
              <Td fontWeight={'bold'}>Motivo:</Td>
              <Td whiteSpace={'break-spaces'}>{req.description}</Td>
            </Tr>
            <Tr>
              <Td fontWeight={'bold'}>Proyecto:</Td>
              <Td>{req.project?.displayName}</Td>
            </Tr>
            <Tr>
              <Td fontWeight={'bold'}>Fuente de financiamiento:</Td>
              <Td>{req.project?.financerName}</Td>
            </Tr>
            <Tr>
              <Td fontWeight={'bold'}>Monto solicitado:</Td>
              <Td>{decimalFormat(req.amountRequested, req.currency)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Box>
        <Text>Presentado por:</Text>
        <Text>Firma:</Text>
        <Text>Fecha:</Text>
      </Box>
    </Box>
  );
};

export default FundRequestPrintPage;
