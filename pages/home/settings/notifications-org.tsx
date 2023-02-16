import OrgNotificationSettingPage from '@/pageContainers/home/settings/organization-settings/OrgNotificationSettings.home.settings';
import SettingsLayout from 'layouts/SettingsLayout';
import React from 'react';

const notificationsOrg = () => {
  return (
    <SettingsLayout>
      <OrgNotificationSettingPage />
    </SettingsLayout>
  );
};

export default notificationsOrg;
