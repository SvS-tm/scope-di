import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiScope } from "../../scope/internals/default-di-scope";

describe
(
    "default-di-scope: Scope-hierarchy",
    () =>
    {
        /*
         • Child scope creation: createChildScope() shares the same registry but has its own cache.
         */
    }
);
