import { adminModProcedure, router } from "../initTrpc";
import prisma from "@/server/db/client";
import { validateSearchableImageEdit } from "@/lib/validations/searchableImage.edit.validate";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const searchableImageRouter = router({
  getById: adminModProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.searchableImage.findUnique({
        where: { id: input.id },
      });
    }),

  edit: adminModProcedure
    .input(validateSearchableImageEdit)
    .mutation(async ({ input }) => {
      return await prisma.searchableImage.update({
        where: { id: input.id },
        data: {
          text: input.text,
          currency: input.currency,
          amount: new Prisma.Decimal(input.amount),
          facturaNumber: input.facturaNumber,
        },
      });
    }),
});
