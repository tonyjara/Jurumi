import Head from 'next/head';
import React from 'react';
import DrawerWithTopBar from '../components/Nav/DrawerWithTopBar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const titleText = `JURUMI ${
    process.env.NODE_ENV === 'development' ? 'DEV' : ''
  }`;
  return (
    <DrawerWithTopBar>
      <Head>
        <title>{titleText}</title>
      </Head>
      {children}
    </DrawerWithTopBar>
  );
};

export default RootLayout;
