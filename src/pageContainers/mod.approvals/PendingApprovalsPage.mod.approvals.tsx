import {
  HStack,
  Radio,
  RadioGroup,
  Text,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import type {
  Account,
  MoneyRequest,
  MoneyResquestApprovalStatus,
  Project,
  Transaction,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import RejectPendingApprovalModal from '../../components/Modals/RejectPendingApproval.modal';
import { ApprovalUtils } from '../../lib/utils/ApprovalUtilts';
import {
  translatedMoneyReqType,
  translatedMoneyRequestApprovalStatus,
} from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import RowOptionsPendingApprovals from './rowOptions.mod.approvals';

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
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

  useEffect(() => {
    if (requestId && !isOpen) {
      onOpen();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, isOpen]);

  const { data, isFetching: pendingRequestsFetching } =
    trpcClient.moneyRequest.getManyComplete.useQuery({ status: statusState });

  const rowHandler = data?.map((x: any) => {
    const {
      needsApproval,
      approvalText,
      approverNames,
      hasBeenApproved,
      hasBeenRejected,
    } = ApprovalUtils(x as any, user);
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />

        <TextCell
          text={needsApproval() ? approvalText : 'No req.'}
          hover={approverNames}
        />

        <EnumTextCell
          text={x.moneyRequestType}
          enumFunc={translatedMoneyReqType}
        />
        <TextCell shortenString hover={x.description} text={x.description} />
        <MoneyCell objectKey={'amountRequested'} data={x} />
        <TextCell text={x.account.displayName} />
        <TextCell text={x.project?.displayName ?? '-'} />

        <RowOptionsPendingApprovals
          hasBeenRejected={hasBeenRejected}
          hasBeenApproved={hasBeenApproved()}
          needsApproval={needsApproval()}
          x={x}
          setRequestId={setRequestId}
        />
      </Tr>
    );
  });

  return (
    <>
      <HStack
        pb={'10px'}
        px={'10px'}
        flexDirection={{ base: 'column', md: 'row' }}
        // flexDir={'row'}
        // alignItems="center"
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
      <DynamicTable
        noHeader
        loading={pendingRequestsFetching}
        headers={[
          'F. Creacion',
          'Aprobación',
          'Tipo',
          'Desc.',
          'Monto',
          'Creador',
          'Proyecto',
          'Opciones',
        ]}
        rows={rowHandler}
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
