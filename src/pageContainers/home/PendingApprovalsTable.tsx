import { Tr } from '@chakra-ui/react';
import type {
  Account,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../components/DynamicTables/Utils/TableSearchbar';
import { translatedMoneyReqType } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import RowOptionsPendingApprovals from './rowOptions.pendingRequests.home';

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
};

const PendingApprovalsTable = () => {
  const [searchValue, setSearchValue] = useState('');

  const { data: moneyRequests } =
    trpcClient.moneyRequest.getManyComplete.useQuery();
  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(
      { id: searchValue },
      { enabled: searchValue.length > 0 }
    );

  const handleDataSource = () => {
    if (!moneyRequests) return [];
    if (findByIdData) return [findByIdData];
    if (moneyRequests) return moneyRequests;
    return [];
  };

  const rowHandler = handleDataSource().map((x) => {
    const approverIds = x.organization.moneyRequestApprovers.map((x) => x.id);
    const approverNames = x.organization.moneyRequestApprovers
      .map((x) => x.displayName)
      .toString()
      .split(',')
      .join(' ,');
    const approvedIds = x.moneyRequestApprovals.map((x) => x.accountId);
    const needsApproval = () => {
      //1. If organization has not designated approvers, then ignore.
      if (x.organization.moneyRequestApprovers.length) {
        //2. If there are no approvals then asume needs approval.
        if (!x.moneyRequestApprovals.length) return true;

        //3. Check if the approvals contain the approvers
        if (isEqual(approvedIds, approverIds)) return false;

        return true;
      }
      return false;
    };
    const approvalText = `${approvedIds.length} de ${approverIds.length}  ${
      needsApproval() ? '❌' : '✅'
    }`;
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

        <RowOptionsPendingApprovals needsApproval={needsApproval()} x={x} />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Solicitudes pendientes'}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por ID"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        loading={isFetching}
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
    </>
  );
};

export default PendingApprovalsTable;
