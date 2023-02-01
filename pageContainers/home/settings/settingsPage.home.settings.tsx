import {
  Button,
  Card,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import OrgNotificationSettingPage from './organization-settings/OrgNotificationSettings.home.settings';

const SettingsPage = () => {
  const user = useSession().data?.user;
  const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  return (
    <Card w={'100%'} h="full">
      <Tabs>
        <TabList>
          <Tab>Perfil</Tab>
          <Tab>Notificaciones</Tab>
          {isAdminOrMod && (
            <>
              <Tab>Notificationes Org.</Tab>
              <Tab>Plantillas de impresión</Tab>
            </>
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <OrgNotificationSettingPage />
          </TabPanel>
          <TabPanel>
            Esta página aun no esta lista
            <Link href={'/home/settings/print-templates'}>
              <Button>Plantillas de impresión</Button>
            </Link>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default SettingsPage;
