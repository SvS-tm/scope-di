import { dependenciesCollectionType } from "../../constants/internals/dependencies-collection-type";
import type { AllowedDependencyKey } from "../../types";
import type { DependenciesCollectionResolutionKey } from "../../types/dependencies-collection-resolution-key";

export const isDependenciesCollectionResolutionKey = (key: any): key is DependenciesCollectionResolutionKey<AllowedDependencyKey> =>
{
    return typeof key === "object" && dependenciesCollectionType in key;
};
