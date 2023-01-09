import { z } from 'zod';
import { publicProcedure, router } from '../initTrpc';

export const greetingRouter = router({
  greeting: publicProcedure
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        text: `Henlo ${input?.name ?? 'wodrl'}`,
      };
    }),
});
