import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { inferAsyncReturnType } from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  session: Session | null;
}
/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    session: _opts.session,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  /* const session = await getSession({ req: opts.req }); */
  const session = await getServerSession(req, res, authOptions);

  return {
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
