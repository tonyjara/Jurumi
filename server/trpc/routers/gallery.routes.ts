import {
  adminModProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';
import prisma from '@/server/db/client';
import { z } from 'zod';

export const galleryRouter = router({
  getManyImages: adminModProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma.searchableImage.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: 'desc' },
      });
    }),
  count: adminModProcedure.query(async () => {
    return await prisma.searchableImage.count();
  }),
});
