import type { FC, ReactElement } from 'react';
import React from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { TRPCTestClientProvider } from './TrpcTestClientProvider';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TRPCTestClientProvider>{children}</TRPCTestClientProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
