// import { createInnerTRPCContext } from '@/lib/utils/trpcClient';
// import { moneyRequestMock } from '@/lib/validations/moneyRequest.validate';
// import type { AppRouter } from '@/server/trpc/routers/router';
// import { appRouter } from '@/server/trpc/routers/router';
// import { test, expect } from '@jest/globals';
// import type { MoneyRequest, PrismaClient } from '@prisma/client';
// import { Prisma } from '@prisma/client';
// import type { inferProcedureInput } from '@trpc/server';
// import { mockDeep } from 'jest-mock-extended';
// import { adminSessionMock, userSessionMock } from '../mocks/MockSessions';

// const prismaMock = mockDeep<PrismaClient>();

// const mockOutPut: MoneyRequest = {
//   id: 'cleyy43mp0003pftwekyy3pny',
//   createdAt: new Date(),
//   updatedAt: null,
//   description: '',
//   status: 'PENDING',
//   moneyRequestType: 'FUND_REQUEST',
//   currency: 'USD',
//   amountRequested: new Prisma.Decimal(100),
//   rejectionMessage: '',
//   archived: false,
//   softDeleted: false,
//   wasCancelled: false,
//   accountId: '',
//   organizationId: '',
//   projectId: null,
//   costCategoryId: null,
//   taxPayerId: null,
//   facturaNumber: null,
// };
// const userCaller = appRouter.createCaller(
//   createInnerTRPCContext({ session: userSessionMock, prisma: prismaMock })
// );
// const adminCaller = appRouter.createCaller(
//   createInnerTRPCContext({ session: adminSessionMock, prisma: prismaMock })
// );
export {};

test('create moneyRequest test', async () => {
  // prismaMock.moneyRequest.create.mockResolvedValue(mockOutPut);
  // type Input = inferProcedureInput<AppRouter['moneyRequest']['create']>;
  // const input: Input = moneyRequestMock({
  //   organizationId: 'clddeo96m0004pfuel2a9tpmb',
  //   moneyRequestType: 'FUND_REQUEST',
  // });
  // const result = await userCaller.moneyRequest.create(input);
  // expect(result.description).toStrictEqual(input.description);
});

test('test find by id', async () => {
  // prismaMock.moneyRequest.findUnique.mockResolvedValue(mockOutPut);
  // type Input = inferProcedureInput<
  //   AppRouter['moneyRequest']['findCompleteById']
  // >;
  // const input: Input = { id: 'cleyy43mp0003pftwekyy3pny' };
  // const result = await adminCaller.moneyRequest.findCompleteById(input);
  // expect(result).not.toBe(null);
  // if (!result) throw 'no result';
  // expect(result.id).toStrictEqual(input.id);
});