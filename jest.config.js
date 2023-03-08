//!Kinda working but not with paths
const nextJest = require('next/jest');
const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});
// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  collectCoverage: true,
  // on node 14.x coverage provider v8 offers good speed and more or less good report
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
  testMatch: ['<rootDir>/**/*.test.*'],
  moduleNameMapper,
  //
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

//! Working with ts, not with testing library
// import { pathsToModuleNameMapper } from 'ts-jest';
// // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// // which contains the path mapping (ie the `compilerOptions.paths` option):
// import { compilerOptions } from './tsconfig.json';
// import type { JestConfigWithTsJest } from 'ts-jest';

// const jestConfig: JestConfigWithTsJest = {
//   clearMocks: true,
//   coverageProvider: 'v8',
//   roots: ['<rootDir>'],
//   moduleDirectories: ['node_modules', '<rootDir>/'],
//   modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
//   moduleNameMapper: pathsToModuleNameMapper(
//     compilerOptions.paths /*, { prefix: '<rootDir>/' } */
//   ),
//   preset: 'ts-jest/presets/js-with-ts',
//   setupFiles: ['dotenv/config'],
//   testMatch: ['<rootDir>/**/*.test.*'],
//   setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
//   transform: {
//     '^.+\\.(js|ts)$': 'ts-jest',
//     '\\.js$': '<rootDir>/node_modules/babel-jest',
//     '^.+\\.tsx?$': [
//       'ts-jest',
//       {
//         isolatedModules: true,
//       },
//     ],
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$',
//     '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$',
//     '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$',
//   ],
// };
// export default jestConfig;

//OLD CONFIG
// // jest.config.js
// const nextJest = require('next/jest');

// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: './',
// });

// // Add any custom config to be passed to Jest
// /** @type {import('jest').Config} */
// const customJestConfig = {
//   // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
//   moduleDirectories: ['node_modules', '<rootDir>/'],
//   // testEnvironment: 'jest-environment-jsdom',
//   testEnvironment: 'jest-environment-jsdom',
//   testMatch: ['<rootDir>/**/*.test.*'],
//   // Add more setup options before each test is run
//   setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js'],
// };

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// module.exports = createJestConfig(customJestConfig);
