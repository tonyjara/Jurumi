import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});
const isAdmin = t.middleware(({ next, ctx }) => {
  //@ts-ignore
  const role = ctx.session?.user?.role;
  if (role !== 'ADMIN') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'admin-only',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
