import { PrismaClient } from '@prisma/client';

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

// import { PrismaClient } from '@prisma/client';

// const env = process.env;
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
//     // env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   });
// export default prisma;
// if (env.NODE_ENV !== 'production') {
//   global.prisma = prisma;
// }
