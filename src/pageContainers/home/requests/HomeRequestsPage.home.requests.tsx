import { Tr, useDisclosure } from '@chakra-ui/react';
import type { MoneyRequest } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../../../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../../../components/DynamicTables/DynamicCells/MoneyCell';
import PercentageCell from '../../../components/DynamicTables/DynamicCells/PercentageCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import CreateExpenseReportModal from '../../../components/Modals/ExpenseReport.create.modal';
import EditMoneyRequestModal from '../../../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../../../components/Modals/MoneyRequest.create.modal';
import { reduceExpenseReports } from '../../../lib/utils/TransactionUtils';
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from '../../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../../lib/utils/trpcClient';
import RowOptionsHomeRequests from './rowOptions.home.requests';

const MoneyRequestsPage = () => {
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const [reqForReport, setReqForReport] = useState<MoneyRequest | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isExpRepOpen,
    onOpen: onExpRepOpen,
    onClose: onExpRepClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }
    return () => {};
  }, [editMoneyRequest, isEditOpen]);
  useEffect(() => {
    if (!isExpRepOpen && reqForReport) {
      setReqForReport(null);
    }
    return () => {};
  }, [reqForReport, isExpRepOpen]);

  const { data: moneyRequests, isFetching } =
    trpcClient.moneyRequest.getMyOwnComplete.useQuery({});

  const handleDataSource = () => {
    if (moneyRequests) return moneyRequests;
    return [];
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear solicitud',
    },
  ];

  const rowHandler = handleDataSource().map((x) => {
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />

        <EnumTextCell
          text={x.status}
          enumFunc={translatedMoneyReqStatus}
          hover={x.rejectionMessage}
        />
        <TextCell text={'-'} />
        <EnumTextCell
          text={x.moneyRequestType}
          enumFunc={translatedMoneyReqType}
        />
        <MoneyCell objectKey={'amountRequested'} data={x} />
        <TextCell text={x.project?.displayName ?? '-'} />
        <TextCell text={x.costCategory?.displayName ?? '-'} />
        <PercentageCell
          total={x.amountRequested}
          executed={reduceExpenseReports(x.expenseReports)}
          currency={x.currency}
        />
        <RowOptionsHomeRequests
          x={x}
          onEditOpen={onEditOpen}
          setEditMoneyRequest={setEditMoneyRequest}
          setReqForReport={setReqForReport}
          onExpRepOpen={onExpRepOpen}
        />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Mis Solicitudes'}
        loading={isFetching}
        options={tableOptions}
        headers={[
          'F. Creacion',
          'Desembolso',
          'Comprobante Desembolso',
          'Tipo',
          'Monto',
          'Proyecto',
          'L. Presu.',
          'Rendido',
          'Opciones',
        ]}
        rows={rowHandler}
      />

      <CreateMoneyRequestModal orgId={null} isOpen={isOpen} onClose={onClose} />
      {reqForReport && (
        <CreateExpenseReportModal
          moneyRequest={reqForReport}
          isOpen={isExpRepOpen}
          onClose={onExpRepClose}
        />
      )}
      {editMoneyRequest && (
        <EditMoneyRequestModal
          moneyRequest={editMoneyRequest}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MoneyRequestsPage;
