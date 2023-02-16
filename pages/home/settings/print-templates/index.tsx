import PrintTemplatesPage from '@/pageContainers/home/settings/print-templates/printTemplatesPage.home.settings.print-templates';
import SettingsLayout from 'layouts/SettingsLayout';
import React from 'react';

const printTemplates = () => {
  return (
    <SettingsLayout>
      <PrintTemplatesPage />
    </SettingsLayout>
  );
};

export default printTemplates;
