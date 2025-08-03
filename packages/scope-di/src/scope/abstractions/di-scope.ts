import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { DependencyKey } from "../../types/dependency-key";
import type { InjectionResult } from "../../types/utilities/injection-result";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";

export type DiScope<T_RegisteredDependencies extends RegisteredDependencies> = 
(
    Disposable
        &
    AsyncDisposable
        &
    {
        resolve<T_DependencyKey extends DependencyKey<T_RegisteredDependencies>>
        (
            key: T_DependencyKey
        )
            : InjectionResult<T_RegisteredDependencies, T_DependencyKey>;

        getDescriptors(): readonly Readonly<DependencyDescriptor>[];

        createChildScope(): DiScope<T_RegisteredDependencies>;
    }
);
