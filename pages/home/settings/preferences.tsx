import PreferencesSettingsPage from '@/pageContainers/home/settings/PreferencesPage.home.settings';
import SettingsLayout from 'layouts/SettingsLayout';
import React from 'react';

const preferences = () => {
  return (
    <SettingsLayout>
      <PreferencesSettingsPage />
    </SettingsLayout>
  );
};

export default preferences;
