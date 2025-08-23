import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiScope } from "../../scope/internals/default-di-scope";

describe
(
    "default-di-scope: Introspection",
    () =>
    {
        /*
         • Empty registry: returns an empty array when no keys/descriptors are present
         • Mixed descriptor types: value/class/factory/async* descriptors all show up as-is with correct fields
         • Shared registry across scopes: a child scope's getDescriptors() matches the parent's (same registry reference)
        */
    }
);
