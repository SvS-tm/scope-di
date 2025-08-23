import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiScope } from "../../scope/internals/default-di-scope";

describe
(
    "default-di-scope: Errors",
    () =>
    {
        /*
         • Unregistered single key: resolve("X") throws DependencyNotRegisteredError.
         • Empty collection key: resolve(collectionKey("X")) throws DependencyNotRegisteredError.
         • Unknown descriptor type: a descriptor with an invalid type throws UnknownDependencyTypeError.
         • Unknown lifetime: a descriptor with an invalid lifetime throws UnknownDependencyLifetimeError.
        */
    }
);
