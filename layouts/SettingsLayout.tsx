import {
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useSession().data?.user;
  const [tabIndex, setTabIndex] = useState(0);
  const isAdminOrMod = user?.role === "ADMIN" || user?.role === "MODERATOR";
  const backgroundColor = useColorModeValue("white", "gray.800");
  const router = useRouter();

  const routesDict = {
    "/home/settigs": 0,
    "/home/settings/preferences": 1,
    "/home/settings/notifications-org": 2,
    "/home/settings/org-membership-preferences": 3,
    "/home/settings/print-templates": 4,
  };
  useEffect(() => {
    //@ts-ignore
    setTabIndex(routesDict[router.asPath]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <Tabs index={tabIndex} w={"100%"}>
      <TabList pb={"10px"} overflowX={"auto"} overflowY="hidden">
        <Link href={"/home/settings"}>
          <Tab whiteSpace={"nowrap"}>Perfil</Tab>
        </Link>
        <Link href={"/home/settings/preferences"}>
          <Tab whiteSpace={"nowrap"}>Preferencias</Tab>
        </Link>
        {isAdminOrMod && (
          <>
            <Link href={"/home/settings/notifications-org"}>
              <Tab whiteSpace={"nowrap"}>Notificationes Org.</Tab>
            </Link>
            <Link href={"/home/settings/org-membership-preferences"}>
              <Tab whiteSpace={"nowrap"}>Preferencias de Asociados</Tab>
            </Link>

            <Link href={"/home/settings/print-templates"}>
              <Tab whiteSpace={"nowrap"}> Plantillas de impresión</Tab>
            </Link>
          </>
        )}
      </TabList>

      <Card backgroundColor={backgroundColor} borderRadius="8px">
        <CardBody>{children}</CardBody>
      </Card>
    </Tabs>
  );
};

export default SettingsLayout;
