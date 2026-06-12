import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  projects: [
    {
      displayName: "runtime",
      clearMocks: true,
      preset: "ts-jest",
      testMatch: [
        "<rootDir>/src/**/*.runtime.test.ts"
      ],
      setupFiles: [
        "<rootDir>/src/tests-setup.ts"
      ]
    },
    {
      displayName: "compiletime",
      runner: "jest-runner-tsd",
      testMatch: [
        "<rootDir>/src/**/*.compiletime.test.ts"
      ]
    }
  ]
};

export default config;
