import { TxCtx } from "../notifications/db/PrismaTypes";

export const getMoneyAccWithLastTx = async ({
  txCtx,
  moneyAccountId,
}: {
  txCtx: TxCtx;
  moneyAccountId: string;
}) => {
  return await txCtx.moneyAccount.findUniqueOrThrow({
    where: { id: moneyAccountId },
    include: {
      transactions: {
        where: {
          NOT: {
            transactionType: {
              in: ["COST_CATEGORY", "PROJECT_IMBURSEMENT"],
            },
          },
        },
        take: 1,
        orderBy: { id: "desc" },
      },
    },
  });
};

export const createSearchableImage = async ({
  txCtx,
  imageName,
  url,
  accountId,
}: {
  accountId: string;
  imageName: string | null | undefined;
  url: string | null | undefined;
  txCtx: TxCtx;
}) => {
  if (!imageName || !url) return null;
  const imageProof = await txCtx?.searchableImage.upsert({
    where: {
      imageName: imageName,
    },
    create: {
      accountId: accountId,
      url: url,
      imageName: imageName,
      text: "",
    },
    update: {},
  });

  return imageProof;
};
