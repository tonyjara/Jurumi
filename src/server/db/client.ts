import { PrismaClient } from '@prisma/client';

const env = process.env;
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
export default prisma;
if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
