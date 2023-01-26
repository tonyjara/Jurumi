import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { Prisma } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import prisma from '@/server/db/client';

export const createSeedTransaction = async ({
  moneyAccId,
  txMock,
  projectId,
  moneyReqId,
  userId,
  amountRequested,
  caller,
  costCategoryId,
}: {
  txMock: FormTransactionCreate;
  projectId: string;
  costCategoryId?: string;
  moneyReqId: string;
  userId: string;
  amountRequested: Prisma.Decimal;
  moneyAccId: string;
  caller: any;
}) => {
  // This function creates and calls a single transaction as if it where an accepted moenyRequest transaction.
  txMock.projectId = projectId;
  txMock.moneyRequestId = moneyReqId;
  txMock.accountId = userId;
  if (txMock.transactions[0]) {
    txMock.costCategoryId = costCategoryId ?? null;
    txMock.transactions[0].transactionAmount = amountRequested;
    txMock.transactions[0].moneyAccountId = moneyAccId;
    txMock.searchableImage = {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName: uuidV4(),
    };
  }

  await caller.transaction.createMany(txMock);
};
