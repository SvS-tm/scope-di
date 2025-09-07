import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: "v8",
  projects: [
    {
      displayName: "react-18",
      coverageDirectory: "coverage-react-18",
      testEnvironment: "jsdom",
      preset: "ts-jest",
      setupFilesAfterEnv: [
        "<rootDir>/src/tests-setup.ts"
      ],
      moduleNameMapper: {
        "^react$": "react18",
        "^react/jsx-runtime$": "react18/jsx-runtime",
        "^react/jsx-dev-runtime$": "react18/jsx-dev-runtime"
      },
      globals: { 
        "ts-jest": { 
          tsconfig: "<rootDir>/tsconfig.react18.json" 
        } 
      }
    },
    {
      displayName: "react-19",
      coverageDirectory: "coverage-react-19",
      testEnvironment: "jsdom",
      preset: "ts-jest",
      setupFilesAfterEnv: [
        "<rootDir>/src/tests-setup.ts"
      ],
      moduleNameMapper: {
        "^react$": "react19",
        "^react/jsx-runtime$": "react19/jsx-runtime",
        "^react/jsx-dev-runtime$": "react19/jsx-dev-runtime"
      },
      globals: { 
        "ts-jest": { 
          tsconfig: "<rootDir>/tsconfig.react19.json" 
        } 
      }
    },
  ] 
};

export default config;
