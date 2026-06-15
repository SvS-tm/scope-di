import type { AllowedDependencyKey, RegisteredDependencies } from "../../types";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import { DefaultDiScope } from "./default-di-scope";

export const createDefaultDiScope = <T_RegisteredDependencies extends RegisteredDependencies = never>
(
    descriptors = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>()
) =>
{
    return new DefaultDiScope<T_RegisteredDependencies>(new DefaultDiDependenciesRegistry(descriptors));
};
