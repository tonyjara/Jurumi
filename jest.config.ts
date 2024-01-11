import { pathsToModuleNameMapper } from "ts-jest";
/* const { compilerOptions } = require('./tsconfig') */
import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testMatch: ["**/__tests__/*|(\\.|/)(test))\\.ts?(x)"],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@/*": ["*"],
    },
    { prefix: "<rootDir>/" },
  ),
};

export default config;
