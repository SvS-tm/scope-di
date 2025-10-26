import type { Config } from "jest";

const config: Config = {
    collectCoverage: true,
    coverageProvider: "v8",
    projects: 
    [
        {
            displayName: "react-18",
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            injectGlobals: false,
            coverageDirectory: "coverage-react-18",
            roots: ["<rootDir>/src"],
            setupFiles: ["<rootDir>/src/tests-setup.ts"],
            setupFilesAfterEnv: ["<rootDir>/src/tests-setup.after-env.ts"],
            testPathIgnorePatterns: ['<rootDir>/.rollup.cache', '<rootDir>/dist'],
            testEnvironment: "jsdom",
            preset: "ts-jest",
            moduleNameMapper: 
            {
                "^react$": "react18",
                "^react/(.*)$": "react18/$1",
                "^react-dom$": "react-dom18",
                "^react-dom/(.*)$": "react-dom18/$1"
            },
            transform: 
            {
                "^.+\\.tsx?$": 
                [
                    "ts-jest", 
                    { 
                        useESM: true, 
                        tsconfig: "<rootDir>/tsconfig.react18.json" 
                    }
                ]
            }
        },
        {
            displayName: "react-19",
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            injectGlobals: false,
            coverageDirectory: "coverage-react-19",
            roots: ["<rootDir>/src"],
            setupFiles: ["<rootDir>/src/tests-setup.ts"],
            setupFilesAfterEnv: ["<rootDir>/src/tests-setup.after-env.ts"],
            testPathIgnorePatterns: ['<rootDir>/.rollup.cache', '<rootDir>/dist'],
            testEnvironment: "jsdom",
            preset: "ts-jest",
            moduleNameMapper: 
            {
                "^react$": "react19",
                "^react/(.*)$": "react19/$1",
                "^react-dom$": "react-dom19",
                "^react-dom/(.*)$": "react-dom19/$1"
            },
            transform: 
            {
                "^.+\\.tsx?$": 
                [
                    "ts-jest", 
                    { 
                        useESM: true, 
                        tsconfig: "<rootDir>/tsconfig.react19.json" 
                    }
                ]
            }
        }
    ]
};

export default config;
