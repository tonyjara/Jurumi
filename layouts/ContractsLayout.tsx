import { Tabs, TabList, Tab } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ContractsLayout = ({ children }: { children: React.ReactNode }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  const routesDict = {
    "/mod/contracts": 0,
    "/mod/contracts/list": 1,
    "/mod/contracts/dashboard": 2,
  };
  useEffect(() => {
    //@ts-ignore
    setTabIndex(routesDict[router.asPath]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <Tabs index={tabIndex} w={"100%"}>
      <TabList pb={"10px"} px={"10px"} overflowX={"auto"} overflowY="hidden">
        <Link href={"/mod/contracts"}>
          <Tab whiteSpace={"nowrap"}>Próximos</Tab>
        </Link>
        <Link href={"/mod/contracts/list"}>
          <Tab whiteSpace={"nowrap"}>Todos</Tab>
        </Link>
        <Link href={"/mod/contracts/dashboard"}>
          <Tab whiteSpace={"nowrap"}>Datos</Tab>
        </Link>
      </TabList>

      <div>{children}</div>
    </Tabs>
  );
};
export default ContractsLayout;
