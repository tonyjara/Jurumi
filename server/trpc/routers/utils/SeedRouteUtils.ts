import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { Prisma } from '@prisma/client';

export const createSeedTransaction = async ({
  moneyAccId,
  txMock,
  projectId,
  moneyReqId,
  userId,
  amountRequested,
  caller,
}: {
  txMock: FormTransactionCreate;
  projectId: string;
  moneyReqId: string;
  userId: string;
  amountRequested: Prisma.Decimal;
  moneyAccId: string;
  caller: any;
}) => {
  txMock.projectId = projectId;
  txMock.moneyRequestId = moneyReqId;
  txMock.accountId = userId;
  if (txMock.transactions[0]) {
    txMock.transactions[0].transactionAmount = amountRequested;
    txMock.transactions[0].moneyAccountId = moneyAccId;
    txMock.transactions[0].transactionProofUrl =
      'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa';
  }

  await caller.transaction.createMany(txMock);
};
