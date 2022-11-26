import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { WEB_URL } from './data/environments';
import { getToken } from 'next-auth/jwt';

export const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;

const redirect = (x: string) => NextResponse.redirect(`${WEB_URL}${x}`);

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.nextUrl.pathname.startsWith('/home')) {
    if (!session) return redirect('/');
  }

  return;
}
