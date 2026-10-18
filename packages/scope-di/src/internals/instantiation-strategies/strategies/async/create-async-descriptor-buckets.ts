import { throwError } from "@svs-tm/system";
import { DependencyNotRegisteredError } from "../../../../errors";
import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";

export function createAsyncDescriptorBuckets
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    keys: readonly DependencyResolutionKey<AllowedDependencyKey>[]
)
{
    return keys.map
    (
        key => Array.isArray(key)
            ? (collections.get(key[0]) ?? throwError<RuntimeDependencyDescriptor[]>(new DependencyNotRegisteredError(key[0])))
            : (singles.get(key) ?? throwError<RuntimeDependencyDescriptor>(new DependencyNotRegisteredError(key)))
    );
}
