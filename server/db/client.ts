import { PrismaClient } from '@prisma/client';

// Routes NEED to import prisma to work on build.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
const env = process.env;

if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ['error'] });
  }
  prisma = global.prisma;
}

export default prisma;
