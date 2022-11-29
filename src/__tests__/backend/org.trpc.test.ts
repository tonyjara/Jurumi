import type { PrismaClient } from '@prisma/client';
import type { inferProcedureInput } from '@trpc/server';
import { mockDeep } from 'jest-mock-extended';
import type { AppRouter } from '../../server/trpc/routers/router';
import { appRouter } from '../../server/trpc/routers/router';
import { mockSessionWithRole } from '../TestUtils/MockNextAuth';

jest.mock('@prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
  // prisma: () => new PrismaClient(),
}));
//! BROKEN TESTS
test.skip('unit test trpc routes', async () => {
  const caller = appRouter.createCaller({
    session: {
      expires: '',
      user: mockSessionWithRole('ADMIN').user,
      status: 'authenticated',
    },
  });

  const orgInput: inferProcedureInput<AppRouter['org']['create']> = {
    id: '1',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    displayName: 'org123',
    allowedUsers: [],
    archived: false,
    softDeleted: false,
  };

  //   prismaMock.organization.create.mockResolvedValue(orgInput);
  const orgCreate = await caller.org.create(orgInput);
  //   const byId = await caller.post.byId({ id: post.id });

  expect(orgCreate).toMatchObject(orgInput);
});
