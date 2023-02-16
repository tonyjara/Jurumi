import ProfileSettingsPage from '@/pageContainers/home/settings/ProfileSettings.home.settings';
import SettingsLayout from 'layouts/SettingsLayout';
import React from 'react';

const index = () => {
  return (
    <SettingsLayout>
      <ProfileSettingsPage />
    </SettingsLayout>
  );
};

export default index;
