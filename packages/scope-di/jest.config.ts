import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  // Let ts-jest handle .ts files as ESM:
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true, tsconfig: "<rootDir>/tsconfig.jest.json" }]
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // Use AfterEnv so the polyfill is available to your tests & matchers
  setupFilesAfterEnv: ["<rootDir>/src/tests-setup.ts"]
};

export default config;
