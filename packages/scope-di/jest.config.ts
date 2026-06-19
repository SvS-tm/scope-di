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
            preset: "ts-jest/presets/default-esm",
            testEnvironment: "node",
            testMatch:
            [
                "<rootDir>/src/**/*.runtime.test.ts"
            ],
            transform: {
                "^.+\\.tsx?$": 
                [
                    "ts-jest", 
                    { 
                        useESM: true, 
                        tsconfig: "<rootDir>/tsconfig.jest.json" 
                    }
                ]
            },
            extensionsToTreatAsEsm: [".ts"],
            moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
            clearMocks: true,
            resetMocks: true,
            restoreMocks: true,
            setupFiles: ["<rootDir>/src/tests-setup.ts"]
        },
        {
            displayName: "compiletime",
            runner: "jest-runner-tsd",
            testMatch:
            [
                "<rootDir>/src/**/*.compiletime.test.ts"
            ]
        }
    ]
};

export default config;
