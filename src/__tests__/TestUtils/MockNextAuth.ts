import * as nextAuthReact from 'next-auth/react';
import type { Session } from 'next-auth';
import type { Role } from '@prisma/client';

//ADD THIS TO ALL TEST FILES => jest.mock('next-auth/react');
export const nextAuthReactMocked = nextAuthReact as jest.Mocked<
  typeof nextAuthReact
>;

export const mockSessionWithRole = (role: Role) => {
  return {
    expires: '',
    user: {
      createdAt: '2022-11-23T01:39:53.782Z',
      displayName: 'Tony',
      email: 'tony@tony.com',
      id: 'claszae5y00008xq0u4wnkiav',
      role,
      updatedAt: '2022-11-23T01:39:04.741Z',
    },
  } as Session;
};

export const unauthenticatedMock = () =>
  nextAuthReactMocked.useSession.mockImplementation(
    //If we want options => _options?: UseSessionOptions<boolean> | undefined
    () => {
      return { data: null, status: 'unauthenticated' };
    }
  );
export const authenticateAdmindMock = () =>
  nextAuthReactMocked.useSession.mockImplementation(() => {
    return {
      data: mockSessionWithRole('ADMIN'),
      status: 'authenticated',
    };
  });
export const authenticateUserMock = () =>
  nextAuthReactMocked.useSession.mockImplementation(() => {
    return {
      data: mockSessionWithRole('USER'),
      status: 'authenticated',
    };
  });

// nextAuthReactMocked.signIn.mockImplementation(() =>
//   Promise.resolve({ error: '', status: 403, ok: false, url: '' })
// );
