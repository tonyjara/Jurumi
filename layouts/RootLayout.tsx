import React from 'react';
import DrawerWithTopBar from '../components/Nav/DrawerWithTopBar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <DrawerWithTopBar>{children}</DrawerWithTopBar>;
};

export default RootLayout;
