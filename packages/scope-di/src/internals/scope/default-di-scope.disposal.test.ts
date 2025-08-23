import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiScope } from "../../scope/internals/default-di-scope";

describe
(
    "default-di-scope: Disposal",
    () =>
    {
        /*
        Sync dispose ([Symbol.dispose]):
            • Triggers async disposals fire-and-forget (not awaited).
            • Calls Symbol.dispose on resolved instances only if they don’t also have Symbol.asyncDispose.
        Async dispose ([Symbol.asyncDispose]):
            • Starts async disposals, runs sync disposals, then awaits all async disposals to finish.
        Matrix of capabilities:
            • Only Symbol.dispose -> called in both paths (sync directly, async also runs it after scheduling async disposals for others).
            • Only Symbol.asyncDispose: -> called in sync path (fire-and-forget), awaited in async path.
            • Both present: only Symbol.asyncDispose should be used.
        Once per instance: 
            • Resolving the same cached instance multiple times leads to one disposal call per instance.
        Collections/sub-deps included: 
            • Disposes everything that was actually resolved within the scope (including collection members and sub-dependencies created in this scope).
         */
    }
);
