import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import prisma from '@/server/db/client';
import { TRPCError } from '@trpc/server';

export const handleWhereImApprover = (
  input: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | undefined;
  },
  userId: string
) => {
  if (input.status === 'PENDING') {
    return {
      moneyRequestApprovals: {
        none: {
          accountId: userId,
        },
      },
    };
  }

  return {
    moneyRequestApprovals: {
      some: {
        accountId: userId,
        status: input.status,
      },
    },
  };
};

/**
 This function throws if the request is of type reimbursement and there is no image or factura number present
 */
export const reimbursementOrderImageGuard = async ({
  input,
}: {
  input: FormMoneyRequest;
}) => {
  if (input.moneyRequestType !== 'REIMBURSMENT_ORDER')
    return { facturaNumber: null, searchableImage: null };
  if (!input.searchableImage?.imageName || !input.searchableImage.url) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'no reimbursement proof',
    });
  }

  const reimbursementProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.searchableImage?.imageName,
    },
    create: {
      url: input.searchableImage.url,
      imageName: input.searchableImage.imageName,
      text: '',
    },
    update: {},
  });
  if (!input.facturaNumber) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'no facturanumber',
    });
  }
  return {
    facturaNumber: input.facturaNumber,
    searchableImage: { id: reimbursementProof.id },
  };
};
