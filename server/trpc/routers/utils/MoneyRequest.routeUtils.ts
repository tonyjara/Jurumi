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
 This function throws if the request is of type reimbursement and there is no image or factura number present, it also creates the searchable image
 */
export const reimbursementOrderImageGuard = async ({
  input,
}: {
  input: FormMoneyRequest;
}) => {
  if (input.moneyRequestType !== 'REIMBURSMENT_ORDER') return null;

  if (!input.searchableImages.length) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'no reimbursement proof',
    });
  }

  for (const searchableImage of input.searchableImages) {
    await prisma?.searchableImage.upsert({
      where: {
        imageName: searchableImage?.imageName,
      },
      create: {
        url: searchableImage.url,
        imageName: searchableImage.imageName,
        text: '',
        facturaNumber: searchableImage.facturaNumber ?? '',
      },
      update: {},
    });
  }

  return input.searchableImages;
};
