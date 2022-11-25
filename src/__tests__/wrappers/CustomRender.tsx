import type { FC, ReactElement } from 'react';
import React from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// export * from '@testing-library/react';
// export { customRender as render };
