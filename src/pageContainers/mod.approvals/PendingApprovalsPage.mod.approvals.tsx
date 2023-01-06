import {
  HStack,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import type {
  Account,
  CostCategory,
  ExpenseReport,
  MoneyRequest,
  MoneyRequestApproval,
  MoneyResquestApprovalStatus,
  Project,
  Transaction,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import { useDynamicTable } from '../../components/DynamicTables/UseDynamicTable';
import RejectPendingApprovalModal from '../../components/Modals/RejectPendingApproval.modal';
import { translatedMoneyRequestApprovalStatus } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import { modApprovalsColumns } from './columns.mod.approvals';

export type MoneyRequestCompleteWithApproval = MoneyRequest & {
  transactions: Transaction[];
  expenseReports: ExpenseReport[];
  account: Account;
  organization: {
    moneyRequestApprovers: {
      id: string;
      displayName: string;
    }[];
    moneyAdministrators: {
      id: string;
      displayName: string;
    }[];
  };
  project: Project | null;
  costCategory: CostCategory | null;
  moneyRequestApprovals: MoneyRequestApproval[];
};

const ApprovalsPage = () => {
  const session = useSession();
  const user = session.data?.user;
  const statusArray: MoneyResquestApprovalStatus[] = [
    'ACCEPTED',
    'PENDING',
    'REJECTED',
  ];
  const [statusState, setStatusState] =
    useState<MoneyResquestApprovalStatus>('PENDING');
  const [requestId, setRequestId] = useState<null | string>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  useEffect(() => {
    if (requestId && !isOpen) {
      onOpen();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, isOpen]);

  const {
    data,
    isFetching: pendingRequestsFetching,
    isLoading,
  } = trpcClient.moneyRequest.getManyComplete.useQuery(
    {
      status: statusState,
      pageIndex,
      pageSize,
      sorting: globalFilter ? sorting : null,
    },
    { keepPreviousData: globalFilter ? true : false }
  );
  const { data: count } = trpcClient.moneyRequest.countWhereStatus.useQuery({
    status: statusState,
  });

  const tableOptions: TableOptions[] = [
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? '✅' : '❌'} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? '✅' : '❌'} Filtro local`,
    },
  ];

  return (
    <>
      <DynamicTable
        headerComp={
          <HStack
            pb={'10px'}
            flexDirection={{ base: 'column', md: 'row' }}
            whiteSpace={'break-spaces'}
          >
            <Text alignSelf={'start'} fontSize={'xl'} fontWeight="bold">
              Aprobación de solicitudes
            </Text>
            <RadioGroup
              alignSelf={{ base: 'start', md: 'auto' }}
              py={{ base: '10px', md: '0px' }}
              value={statusState}
              onChange={(e) => {
                setStatusState(e as any);
              }}
            >
              <HStack spacing={4}>
                {statusArray.map((x) => (
                  <Radio value={x} key={x}>
                    <Text
                      textOverflow={'ellipsis'}
                      maxW={{ base: '50px', md: '100px' }}
                      overflow="hidden"
                      whiteSpace={'nowrap'}
                    >
                      {translatedMoneyRequestApprovalStatus(x)}
                    </Text>
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          </HStack>
        }
        loading={pendingRequestsFetching || isLoading}
        columns={modApprovalsColumns({
          user,
          setRequestId,
          pageIndex,
          pageSize,
        })}
        options={tableOptions}
        data={data ?? []}
        count={count ?? 0}
        {...dynamicTableProps}
        // headers={[
        //   'F. Creacion',
        //   'Aprobación',
        //   'Tipo',
        //   'Desc.',
        //   'Monto',
        //   'Creador',
        //   'Proyecto',
        //   'Opciones',
        // ]}
        // rows={rowHandler}
      />

      {requestId && (
        <RejectPendingApprovalModal
          isOpen={isOpen}
          onClose={() => {
            setRequestId(null);
            onClose();
          }}
          requestId={requestId}
        />
      )}
    </>
  );
};

export default ApprovalsPage;
