import type { AllowedDependencyKey, DependencyDescriptor, RegisteredDependencies } from "../../types";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import { DefaultDiScope } from "./default-di-scope";

export const createDefaultDiScope = <T_RegisteredDependencies extends RegisteredDependencies = never>
(
    descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
) =>
{
    return new DefaultDiScope<T_RegisteredDependencies>(new DefaultDiDependenciesRegistry(descriptors));
};
