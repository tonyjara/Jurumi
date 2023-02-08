import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import OrgNotificationSettingPage from './organization-settings/OrgNotificationSettings.home.settings';
import PreferencesSettingsPage from './PreferencesPage.home.settings';
import ProfileSettingsPage from './ProfileSettings.home.settings';

const SettingsPage = () => {
  const user = useSession().data?.user;
  const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const backgroundColor = useColorModeValue('white', 'gray.800');
  return (
    <Tabs w={'100%'}>
      <TabList pb={'10px'} overflowX={'auto'} overflowY="hidden">
        <Tab whiteSpace={'nowrap'}>Perfil</Tab>
        <Tab whiteSpace={'nowrap'}>Preferencias</Tab>
        {isAdminOrMod && (
          <>
            <Tab whiteSpace={'nowrap'}>Notificationes Org.</Tab>
            <Tab whiteSpace={'nowrap'}> Plantillas de impresión</Tab>
          </>
        )}
      </TabList>

      <TabPanels>
        <TabPanel backgroundColor={backgroundColor} borderRadius="8px">
          <ProfileSettingsPage />
        </TabPanel>
        <TabPanel>
          <PreferencesSettingsPage />
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
  );
};

export default SettingsPage;
