import { describe, expect, it } from "@jest/globals";
import { DependencyNotRegisteredError } from "../../errors/dependency-not-registered-error";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import { UnknownDependencyLifetimeError } from "../../errors/unknown-dependency-lifetime-error";
import { createDefaultDiScope } from "./default-di-scope.test-helpers";

describe
(
    "default-di-scope: Errors",
    () =>
    {
        /*
         • Unknown lifetime: a descriptor with an invalid lifetime throws UnknownDependencyLifetimeError.
        */
        it
        (
            "Unregistered single key: resolve() of unregistered key throws DependencyNotRegisteredError", 
            () => 
            {
                const scope = createDefaultDiScope();

                expect(() => scope.resolve("key" as never)).toThrow(DependencyNotRegisteredError);
            }
        );

        it
        (
            "Unregistered collection key: resolve() of unregistered collection key throws DependencyNotRegisteredError", 
            () => 
            {
                const scope = createDefaultDiScope();

                expect(() => scope.resolve(["key"] as never)).toThrow(DependencyNotRegisteredError);
            }
        );

        it
        (
            "Unknown descriptor type: resolving dependency with a descriptor of an invalid type throws UnknownDependencyTypeError", 
            () => 
            {
                const key = "Key";

                class Dependency {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key: key,
                                type: -1 as DependencyDescriptorType,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Dependency
                            } as DependencyDescriptor
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                expect(() => scope.resolve(key as never)).toThrow(UnknownDependencyTypeError);
            }
        );

        it
        (
            "Unknown lifetime: resolving dependency with a descriptor of an invalid lifetime throws UnknownDependencyLifetimeError", 
            () => 
            {
                const key = "Key";

                class Dependency {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key: key,
                                type: DependencyDescriptorType.Class,
                                lifetime: -1 as DependencyLifetime,
                                constructor: Dependency
                            } as DependencyDescriptor
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                expect(() => scope.resolve(key as never)).toThrow(UnknownDependencyLifetimeError);
            }
        );
    }
);
