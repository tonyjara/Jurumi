import React from 'react';
import MySidebarWithHeader from '../components/Nav/MySidebarWithHeader';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <MySidebarWithHeader>{children}</MySidebarWithHeader>;
};

export default RootLayout;
