import type { FactoryDependencyDescriptor } from "../../../../../../../types/factory-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createTwoArgumentsFactoryStrategy<T_Dependency>
(
    descriptor: FactoryDependencyDescriptor<T_Dependency>,
    resolvers: InstantiationStrategy<unknown>[]
)
    : InstantiationStrategy<T_Dependency>
{
    const factory = descriptor.factory;
    const [resolveFirst, resolveSecond] = resolvers;

    return scope =>
    {
        const dependency = factory(resolveFirst(scope), resolveSecond(scope));

        if ((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose] != null)
            scope.addAsyncDisposableDependency(dependency as AsyncDisposable);
        else if ((dependency as Partial<Disposable>)[Symbol.dispose] != null)
            scope.addDisposableDependency(dependency as Disposable);

        return dependency;
    };
}
