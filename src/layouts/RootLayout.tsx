import { useSession } from 'next-auth/react';
import React from 'react';
import TopNavbar from '../components/Nav/TopNavbar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  return (
    <>
      <TopNavbar />
      {children}
    </>
  );
};

export default RootLayout;
