/** @jest-config-loader esbuild-register */
import type { Config } from "jest";

const config: Config = 
{
    collectCoverage: true,
    coverageDirectory: "coverage",
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
            displayName: "runtime",
            testEnvironment: "node",
            testMatch:
            [
                "<rootDir>/src/**/*.runtime.test.ts"
            ],
            transform: {
                "^.+\\.tsx?$": 
                [
                    "@swc/jest", 
                    { 
                        jsc:
                        {
                            parser:
                            {
                                syntax: "typescript"
                            },
                            target: "es2022"
                        },
                        module:
                        {
                            type: "commonjs"
                        }
                    }
                ]
            },
            moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            setupFiles: ["<rootDir>/src/tests-setup.ts"]
        }
    ]
};

export default config;
