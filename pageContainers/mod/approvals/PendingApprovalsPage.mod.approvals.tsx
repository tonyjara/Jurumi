import {
  HStack,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { MoneyResquestApprovalStatus, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import RejectPendingApprovalModal from "@/components/Modals/RejectPendingApproval.modal";
import { translatedMoneyRequestApprovalStatus } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import { modApprovalsColumns } from "./columns.mod.approvals";
import { RowOptionApprovals } from "./rowOptions.mod.approvals";
import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";

const ApprovalsPage = () => {
  const statusArray: MoneyResquestApprovalStatus[] = [
    "ACCEPTED",
    "PENDING",
    "REJECTED",
  ];

  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const [statusState, setStatusState] =
    useState<MoneyResquestApprovalStatus>("PENDING");
  const [requestId, setRequestId] = useState<null | string>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

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
  } = trpcClient.moneyApprovals.getManyCompleteForApprovalPage.useQuery({
    status: statusState,
    pageIndex,
    pageSize,
    sorting,
    whereFilterList,
  });
  const { data: count } = trpcClient.moneyApprovals.countWhereStatus.useQuery({
    status: statusState,
    whereFilterList,
  });

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionApprovals
        setMenuData={setMenuData}
        x={x}
        setRequestId={setRequestId}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title="Aprobación de solicitudes"
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        headerComp={
          <HStack flexDirection={{ base: "column", md: "row" }}>
            <RadioGroup
              mt="10px"
              value={statusState}
              onChange={(e) => {
                setStatusState(e as any);
              }}
            >
              <HStack spacing={4}>
                {statusArray.map((x) => (
                  <Radio value={x} key={x}>
                    <Text
                      textOverflow={"ellipsis"}
                      maxW={{ base: "80px", md: "140px" }}
                      overflow="hidden"
                      whiteSpace={"nowrap"}
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
        rowOptions={rowOptionsFunction}
        columns={modApprovalsColumns({
          pageIndex,
          pageSize,
        })}
        data={data ?? []}
        count={count ?? 0}
        {...dynamicTableProps}
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
