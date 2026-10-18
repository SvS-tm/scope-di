import { Reflection } from "@svs-tm/system";
import { generateIdentifier } from "../../../../../../helpers/internals/identifier-helpers";
import { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import { DependencyLifetime } from "../../../../../../types/dependency-lifetime";
import type { FactoryDependencyDescriptor } from "../../../../../../types/factory-dependency-descriptor";
import { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";
import { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { DefaultDiScope } from "../../../../../scope/default-di-scope";
import { createSyncResolver } from "../../create-sync-resolver";

export function createCodeGenerationFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const factory = descriptor.factory;
    const keys = descriptor.subDependenciesKeys ?? [];
    const resolvers = keys.map(key => createSyncResolver(collectionRegistrations, singularRegistrations, key));
    const id = generateIdentifier().toString();
    const resolversParameterName = `resolvers$${id}`;
    const factoryParameterName = `factory$${id}`;
    const scopeParameterName = `scope$${id}`;

    const dependenciesResolution = keys.map
    (
        (_key, index) =>
        `const dependency${index} = ${resolversParameterName}[${index}](${scopeParameterName});`
    )
        .join("\n");

    const resolvedDependencies = keys.map((_key, index) => `dependency${index}`)
        .join(", ");

    /**
     * @note Detect transient disposables inside each generated strategy for performance.
     * V8 collects property-access feedback per lookup site. A shared detector sees unrelated instance
     * shapes and can become megamorphic; separate generated sites can stay monomorphic when each
     * descriptor produces a consistent shape. A deep-chain experiment confirmed this behavior.
     * Keeping detection here also avoids a separate tracking-strategy call after construction.
     * Check every instance; factories and constructors can produce different disposal properties.
     */
    const construction = (descriptor.lifetime === DependencyLifetime.Transient)
        ? (
            `const instance$${id} = ${factoryParameterName}(${resolvedDependencies});
            if (instance$${id}[Symbol.asyncDispose] != null)
                ${scopeParameterName}.${Reflection.runtimeNameOf<DefaultDiScope>(scope => scope.addAsyncDisposableDependency)}(instance$${id});
            else if (instance$${id}[Symbol.dispose] != null)
                ${scopeParameterName}.${Reflection.runtimeNameOf<DefaultDiScope>(scope => scope.addDisposableDependency)}(instance$${id});
            return instance$${id};`
        )
        : `return ${factoryParameterName}(${resolvedDependencies});`;

    const strategyFactory = new Function
    (
        factoryParameterName,
        resolversParameterName,
        `return function instantiate$${id}(${scopeParameterName})
        {
            ${dependenciesResolution}
            ${construction}
        };`
    );

    return strategyFactory(factory, resolvers);
}
