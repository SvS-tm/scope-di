import { describe, expect, it, jest } from "@jest/globals";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import { DefaultDiScope } from "./default-di-scope";

describe
(
    "default-di-scope: Disposal",
    () =>
    {
        /*
        Sync dispose ([Symbol.dispose]):
        Async dispose ([Symbol.asyncDispose]):
        Matrix of capabilities:
            • Only Symbol.dispose -> called in both paths (sync directly, async also runs it after scheduling async disposals for others).
            • Only Symbol.asyncDispose: -> called in sync path (fire-and-forget), awaited in async path.
            • Both present: only Symbol.asyncDispose should be used.
        Once per instance:
            • Resolving the same cached instance multiple times leads to one disposal call per instance.
        Collections/sub-deps included: 
            • Disposes everything that was actually resolved within the scope (including collection members and sub-dependencies created in this scope).
         */
        it
        (
            "Sync dispose ([Symbol.dispose]) called upon scope disposal",
            () => 
            {
                class Dependency1 implements Disposable
                {
                    public disposed = false;
                    
                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    };
                }

                using disposeSpy = jest
                    .spyOn(Dependency1.prototype, Symbol.dispose);

                const key = "Value";

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Dependency1
                            }
                        ]
                    );

                {
                    using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(key as never);
                }

                expect(disposeSpy).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "Async dispose ([Symbol.asyncDispose]) called in background after scope disposal",
            async () =>
            {
                let asyncDisposalPromise = Promise.resolve();

                const disposeAsyncDependencies = DefaultDiScope.prototype["disposeAsyncDependencies"];

                jest
                    .spyOn(DefaultDiScope.prototype, "disposeAsyncDependencies" as any)
                    .mockImplementation
                    (
                        function (this: DefaultDiScope, ...args)
                        {
                            asyncDisposalPromise = disposeAsyncDependencies.apply(this, args as any);

                            return asyncDisposalPromise;
                        }
                    );
                
                class Dependency1 implements AsyncDisposable
                {
                    public disposed = false;
                    
                    public async [Symbol.asyncDispose]()
                    {
                        this.disposed = true;
                    };
                }

                using asyncDisposeSpy = jest
                    .spyOn(Dependency1.prototype, Symbol.asyncDispose);

                const key = "Value";

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Dependency1
                            }
                        ]
                    );

                {
                    using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(key as never);
                }

                await asyncDisposalPromise;

                expect(asyncDisposeSpy).toHaveBeenCalledTimes(1);
            }
        );
    }
);
