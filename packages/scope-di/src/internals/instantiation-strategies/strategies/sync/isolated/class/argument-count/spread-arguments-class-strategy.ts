import type { ClassDependencyDescriptor } from "../../../../../../../types/class-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createSpreadArgumentsClassStrategy<T_Dependency>
(
    descriptor: ClassDependencyDescriptor<T_Dependency>,
    resolvers: InstantiationStrategy<unknown>[]
)
    : InstantiationStrategy<T_Dependency>
{
    const constructor = descriptor.constructor;

    return scope =>
    {
        const dependency = new constructor(...resolvers.map(resolveDependency => resolveDependency(scope)));

        if ((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose] != null)
            scope.addAsyncDisposableDependency(dependency as AsyncDisposable);
        else if ((dependency as Partial<Disposable>)[Symbol.dispose] != null)
            scope.addDisposableDependency(dependency as Disposable);

        return dependency;
    };
}
