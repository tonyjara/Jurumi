import type { Prisma, PrismaClient } from "@prisma/client";

//** Prisma context for transactions */
export type TxCtx = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never
    /* Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined */
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
