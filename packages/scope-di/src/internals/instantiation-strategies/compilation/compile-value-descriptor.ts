import { Writable } from "@svs-tm/system";
import type { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../types/internals/runtime-dependency-descriptor";
import type { ValueDependencyDescriptor } from "../../../types/value-dependency-descriptor";

export function compileValueDescriptor
(
    descriptor: ValueDependencyDescriptor<unknown, AllowedDependencyKey>
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey, 
        unknown, 
        ValueDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    (descriptor as Writable<RuntimeDependencyDescriptor>).instatiationStrategy = () => descriptor.value;
}
