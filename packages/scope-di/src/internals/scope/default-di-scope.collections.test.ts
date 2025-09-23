import { describe } from "@jest/globals";

describe
(
    "default-di-scope: Collections",
    () =>
    {
        /*
            • Resolving a collection key returns an array with one entry per descriptor registered under the mapping key.
            • Verify array order matches your registry rules (e.g., latest-first if that's how you populate arrays).
            • Collection may include Value/Class/Factory/Async* - each element resolves per its own descriptor.
            • In a sync parent (sync class/factory depends on a collection), injected collection contains promises at async positions (not awaited).
            • In an async parent (async class/factory depends on a collection), all members are awaited before the parent is invoked.
            • Duplicates allowed: registering the same instance twice produces two identical references in the collection.
         */
    }
);
