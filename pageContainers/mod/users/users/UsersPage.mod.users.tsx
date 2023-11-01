import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import CreateAccountModal from "@/components/Modals/account.create.modal";
import EditAccountModal from "@/components/Modals/account.edit.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { FormAccount } from "@/lib/validations/account.validate";
import { modUsersColumns } from "./columns.mod.users";
import RowOptionsModUsers from "./rowOptions.mod.users";

const UsersPage = () => {
  const [editAccount, setEditAccount] = useState<FormAccount | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  const { data, isFetching, isLoading } = trpcClient.account.getMany.useQuery({
    pageIndex,
    pageSize,
    sorting,
  });
  const { data: count } = trpcClient.account.count.useQuery();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editAccount) {
      setEditAccount(null);
    }
    return () => {};
  }, [editAccount, isEditOpen]);

  const options: TableOptions[] = [
    {
      onClick: onOpen,
      label: "Crear usuario",
    },
  ];

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsModUsers
        x={x}
        onEditOpen={onEditOpen}
        setEditAccount={setEditAccount}
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Usuarios"}
        options={options}
        columns={modUsersColumns({
          pageIndex,
          pageSize,
        })}
        loading={isFetching || isLoading}
        data={data ?? []}
        count={count ?? 0}
        rowOptions={rowOptionsFunction}
        {...dynamicTableProps}
      />
      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
      {editAccount && (
        <EditAccountModal
          account={editAccount}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default UsersPage;
