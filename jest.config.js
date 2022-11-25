const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './src' });

// Any custom config you want to pass to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
  rootDir: './src/__tests__',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  // modulePaths: ['<rootDir>/lib'],
  // transformIgnorePatterns: ['/next[/\\\\]dist/', '/\\.next/'],
  globals: {
    AbortSignal: global.AbortSignal,
  },
  // moduleNameMapper: {
  //   '@next/font/(.*)': '@next/font/$1',
  // },
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
