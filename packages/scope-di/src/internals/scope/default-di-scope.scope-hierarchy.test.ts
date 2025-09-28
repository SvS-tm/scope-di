import { describe, it } from "@jest/globals";

describe
(
    "default-di-scope: Scope-hierarchy",
    () =>
    {
        /*
         • Child scope creation: createChildScope() shares the same registry but has its own cache.
         */
        it("dummy", () => {});
    }
);
