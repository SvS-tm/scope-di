/** @jest-config-loader esbuild-register */
import { resolve } from "node:path";
import type { Config } from "jest";

const rootDir = resolve(__dirname, "../..");

const config: Config =
{
    rootDir,
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
            rootDir,
            displayName: "runtime",
            testEnvironment: "node",
            testMatch: ["<rootDir>/src/**/*.runtime.test.ts"],
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
