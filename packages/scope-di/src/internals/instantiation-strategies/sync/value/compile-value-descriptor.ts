import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import type { ValueDependencyDescriptor } from "../../../../types/value-dependency-descriptor";

export function compileValueDescriptor
(
    descriptor: ValueDependencyDescriptor<unknown, AllowedDependencyKey>
)
    : RuntimeDependencyDescriptor
{
    return {
        ...descriptor,
        instatiationStrategy: () => descriptor.value
    };
}
