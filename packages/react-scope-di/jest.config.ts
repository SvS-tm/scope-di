/** @jest-config-loader esbuild-register */
import type { Config } from "jest";

const config: Config = {
    collectCoverage: true,
    coverageProvider: "v8",
    reporters:
    [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "test-results",
                outputName: "junit.xml"
            }
        ]
    ],
    projects: 
    [
        {
            displayName: "react-18-runtime",
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            injectGlobals: false,
            coverageDirectory: "coverage-react-18",
            roots: ["<rootDir>/src"],
            setupFiles: ["<rootDir>/src/tests-setup.ts"],
            setupFilesAfterEnv: ["<rootDir>/src/tests-setup.after-env.ts"],
            testMatch: ["<rootDir>/src/**/*.runtime.test.ts?(x)"],
            testPathIgnorePatterns: ['<rootDir>/.rollup.cache', '<rootDir>/dist'],
            testEnvironment: "jsdom",
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
                    "@swc/jest", 
                    { 
                        jsc:
                        {
                            parser:
                            {
                                syntax: "typescript",
                                tsx: true
                            },
                            transform:
                            {
                                react:
                                {
                                    runtime: "automatic"
                                }
                            },
                            target: "es2022"
                        },
                        module:
                        {
                            type: "commonjs"
                        }
                    }
                ]
            }
        },
        {
            displayName: "react-19-runtime",
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            injectGlobals: false,
            coverageDirectory: "coverage-react-19",
            roots: ["<rootDir>/src"],
            setupFiles: ["<rootDir>/src/tests-setup.ts"],
            setupFilesAfterEnv: ["<rootDir>/src/tests-setup.after-env.ts"],
            testMatch: ["<rootDir>/src/**/*.runtime.test.ts?(x)"],
            testPathIgnorePatterns: ['<rootDir>/.rollup.cache', '<rootDir>/dist'],
            testEnvironment: "jsdom",
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
                    "@swc/jest", 
                    { 
                        jsc:
                        {
                            parser:
                            {
                                syntax: "typescript",
                                tsx: true
                            },
                            transform:
                            {
                                react:
                                {
                                    runtime: "automatic"
                                }
                            },
                            target: "es2022"
                        },
                        module:
                        {
                            type: "commonjs"
                        }
                    }
                ]
            }
        }
    ]
};

export default config;
