import * as nextAuthReact from 'next-auth/react';
import type { Account, Role } from '@prisma/client';

//ADD THIS TO ALL TEST FILES => jest.mock('next-auth/react');
export const nextAuthReactMocked = nextAuthReact as jest.Mocked<
  typeof nextAuthReact
>;

const user: (x: Role) => Omit<Account, 'password'> = (x) => {
  return {
    createdAt: new Date(),
    displayName: 'Tony',
    email: 'tony@tony.com',
    id: 'claszae5y00008xq0u4wnkiav',
    role: x,
    updatedAt: new Date(),
    organizationId: null,
    isVerified: true,
    active: true,
  };
};

export const mockSessionWithRole = (role: Role) => {
  return {
    expires: '',
    user: user(role),
  };
};

export const unauthenticatedMock = () =>
  nextAuthReactMocked.useSession.mockImplementation(
    //If we want options => _options?: UseSessionOptions<boolean> | undefined
    () => {
      return { data: null, status: 'unauthenticated' };
    }
  );
export const authenticateAdmindMock = () =>
  //@ts-ignore
  nextAuthReactMocked.useSession.mockImplementation(() => {
    return {
      data: mockSessionWithRole('ADMIN'),
      status: 'authenticated',
    };
  });
export const authenticateUserMock = () =>
  //@ts-ignore
  nextAuthReactMocked.useSession.mockImplementation(() => {
    return {
      data: mockSessionWithRole('USER'),
      status: 'authenticated',
    };
  });

// nextAuthReactMocked.signIn.mockImplementation(() =>
//   Promise.resolve({ error: '', status: 403, ok: false, url: '' })
// );
