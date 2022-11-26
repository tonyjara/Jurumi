import { PrismaClient } from '@prisma/client';
import type { inferProcedureInput } from '@trpc/server';
import type { Session } from 'next-auth';
import { createContextInner } from '../../server/trpc/context';
import type { AppRouter } from '../../server/trpc/routers/router';
import { appRouter } from '../../server/trpc/routers/router';
import { mockSessionWithRole } from '../TestUtils/MockNextAuth';
import { prismaMock } from '../TestUtils/MockPrisma';

//! BOKEN: PRISMA UNDEFINED
test.skip('unit test trpc routes', async () => {
  // const ctx = await createContextInner({
  //   session: {
  //     expires: '',
  //     user: mockSessionWithRole('ADMIN').user,
  //     status: 'authenticated',
  //   } as Session,
  // });

  const caller = appRouter.createCaller({
    session: {
      expires: '',
      user: mockSessionWithRole('ADMIN').user,
      status: 'authenticated',
    } as Session,
  });

  const orgInput: inferProcedureInput<AppRouter['org']['create']> = {
    id: '1',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    displayName: 'org123',
    accountId: '',
    allowedUsers: [],
    archived: false,
    softDeleted: false,
  };

  //   prismaMock.organization.create.mockResolvedValue(orgInput);
  const orgCreate = await caller.org.create(orgInput);
  //   const byId = await caller.post.byId({ id: post.id });

  expect(orgCreate).toMatchObject(orgInput);
});
