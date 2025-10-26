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
                    }
                }

                const disposeSpy = jest
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

                const asyncDisposeSpy = jest
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

        it
        (
            "Implemented only sync dispose ([Symbol.dispose]) called upon async disposal of scope",
            async () => 
            {
                class Dependency1 implements Disposable
                {
                    public disposed = false;
                    
                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    };
                }

                const disposeSpy = jest
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
                    await using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(key as never);
                }

                expect(disposeSpy).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "Implemented only async dispose ([Symbol.dispose]) called upon async disposal of scope",
            async () => 
            {
                class Dependency1 implements AsyncDisposable
                {
                    public disposed = false;
                    
                    public async [Symbol.asyncDispose]()
                    {
                        this.disposed = true;
                    };
                }

                const asyncDisposeSpy = jest
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
                    await using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(key as never);
                }

                expect(asyncDisposeSpy).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "Implemented both async/sync dispose ([Symbol.dispose]/[Symbol.asyncDispose]) - only asyncDispose called upon disposal of scope",
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

                class Dependency1 implements Disposable, AsyncDisposable
                {
                    public disposed = false;
                    
                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }

                    public async [Symbol.asyncDispose]()
                    {
                        this.disposed = true;
                    }
                }

                const asyncDisposeSpy = jest
                    .spyOn(Dependency1.prototype, Symbol.asyncDispose);

                const syncDisposeSpy = jest
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

                await asyncDisposalPromise;

                expect(asyncDisposeSpy).toHaveBeenCalledTimes(1);
                expect(syncDisposeSpy).not.toHaveBeenCalled();
            }
        );

        it
        (
            "Implemented both async/sync dispose ([Symbol.dispose]/[Symbol.asyncDispose]) - only asyncDispose called upon async disposal of scope",
            async () => 
            {
                class Dependency1 implements Disposable, AsyncDisposable
                {
                    public disposed = false;
                    
                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }

                    public async [Symbol.asyncDispose]()
                    {
                        this.disposed = true;
                    }
                }

                const asyncDisposeSpy = jest
                    .spyOn(Dependency1.prototype, Symbol.asyncDispose);

                const syncDisposeSpy = jest
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
                    await using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(key as never);
                }

                expect(asyncDisposeSpy).toHaveBeenCalledTimes(1);
                expect(syncDisposeSpy).not.toHaveBeenCalled();
            }
        );

        it
        (
            "Disposed everything upon scope disposal including sub dependencies",
            () => 
            {
                class SubDependency1 implements Disposable
                {
                    public disposed = false;

                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }   
                }

                class SubDependency2 implements Disposable
                {
                    public disposed = false;

                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }   
                }

                class SubDependency3 implements Disposable
                {
                    public disposed = false;

                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }   
                }

                class MainDependency implements Disposable
                {
                    public disposed = false;
                    
                    public constructor(
                        private readonly subDependency1: SubDependency1,
                        private readonly subDependency2: SubDependency2,
                        private readonly subDependency3: SubDependency3
                    )
                    {
                    }

                    public test()
                    {
                        console.log(this.subDependency1, this.subDependency2, this.subDependency3);
                    }

                    public [Symbol.dispose]()
                    {
                        this.disposed = true;
                    }
                }

                const mainSyncDisposeSpy = jest
                    .spyOn(MainDependency.prototype, Symbol.dispose);

                const subDependency1SyncDisposeSpy = jest
                    .spyOn(SubDependency1.prototype, Symbol.dispose);

                const subDependency2SyncDisposeSpy = jest
                    .spyOn(SubDependency2.prototype, Symbol.dispose);

                const subDependency3SyncDisposeSpy = jest
                    .spyOn(SubDependency3.prototype, Symbol.dispose);

                const mainKey = "Main";
                const subDependencyKey1 = "subDependencyKey1";
                const subDependencyKey2 = "subDependencyKey2";
                const subDependencyKey3 = "subDependencyKey3";

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        mainKey,
                        [
                            {
                                key: mainKey,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: MainDependency,
                                subDependenciesKeys: [
                                    subDependencyKey1,
                                    subDependencyKey2,
                                    subDependencyKey3
                                ]
                            }
                        ]
                    )
                    .set
                    (
                        subDependencyKey1,
                        [
                            {
                                key: subDependencyKey1,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: SubDependency1
                            }
                        ]
                    )
                    .set
                    (
                        subDependencyKey2,
                        [
                            {
                                key: subDependencyKey2,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: SubDependency2
                            }
                        ]
                    )
                    .set
                    (
                        subDependencyKey3,
                        [
                            {
                                key: subDependencyKey3,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: SubDependency3
                            }
                        ]
                    );

                {
                    using scope = new DefaultDiScope(descriptors);
    
                    scope.resolve(mainKey as never);
                }

                expect(mainSyncDisposeSpy).toHaveBeenCalledTimes(1);
                expect(subDependency1SyncDisposeSpy).toHaveBeenCalledTimes(1);
                expect(subDependency2SyncDisposeSpy).toHaveBeenCalledTimes(1);
                expect(subDependency3SyncDisposeSpy).toHaveBeenCalledTimes(1);
            }
        );
    }
);
