import type { Config } from "jest";

const config: Config = 
{
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
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
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    setupFiles: ["<rootDir>/src/tests-setup.ts"]
};

export default config;
