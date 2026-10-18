import { jest } from "@jest/globals";

// Source tests do not run Rollup. Isolation loading is mocked in builder tests.
jest.mock
(
    "virtual:isolated-transient-strategy-module-path",
    () => ({ isolatedTransientStrategyModulePath: "unused-in-source-tests" }),
    { virtual: true }
);

process.on
(
    "unhandledRejection", 
    (reason, promise) => 
    {
        console.error
        (
            "Unhandled Rejection at:", 
            promise, 
            "reason:", 
            reason
        );
    }
);
