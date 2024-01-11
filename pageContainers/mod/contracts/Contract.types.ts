import { Prisma } from "@prisma/client";

export const getManyContractsArgs =
  Prisma.validator<Prisma.ContractsDefaultArgs>()({
    include: {
      payments: {
        orderBy: {
          dateDue: "asc",
        },
      },
      moneyRequests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      },
    },
  });

export type GetManyContractsType = Prisma.ContractsGetPayload<
  typeof getManyContractsArgs
>;
