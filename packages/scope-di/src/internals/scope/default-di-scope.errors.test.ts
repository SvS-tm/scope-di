import { describe } from "@jest/globals";

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
