import { DependencyDescriptor, DependencyDescriptorType, DependencyMappingKey, DependencyResolutionKey, DiScope, isAsyncDescriptor, RegisteredDependencies } from "@svs-tm/scope-di";
import { ChancyValue, Enumerable, isSafeReference, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";

export enum DependenciesResolutionTraceResult
{
    Sync,
    AsyncSettled,
    Async
}

function traceDependencyResolutionByDescriptor<T_RegisteredDependencies extends RegisteredDependencies>
(
    scope: DiScope<T_RegisteredDependencies>,
    descriptor: DependencyDescriptor
)
    : DependenciesResolutionTraceResult
{
    if (isAsyncDescriptor(descriptor))
    {
        const result = scope.findResolvedDependencyByDescriptor(descriptor);
        
        if (ChancyValue.isSuccess(result))
        {
            const resolvedValue = ChancyValue.get(result);
            
            if (resolvedValue instanceof Promise)
            {
                const trackedPromise = TrackedPromise.track(resolvedValue);
                
                switch (trackedPromise[TrackedPromise.status])
                {
                    case TrackedPromiseStatus.Success:
                        return DependenciesResolutionTraceResult.AsyncSettled;
                        
                    /**
                     * @note If Promise is in pendig or error state, we'll mark it as async
                     * (so we won't polute everything with errors when its not needed)
                     */
                    default:
                        return DependenciesResolutionTraceResult.Async;
                }
            }
            /**
             * @note It could be PromiseLike? I guess no, but anyway lets guard here
             */
            else
                return DependenciesResolutionTraceResult.Async;
        }
        /**
         * @note in case it is class async, and we don't have any cached promise
         * we'll need to traverse dependencies tree recursively, as it might be that 
         * all dependencies are AsyncSettled or Sync, then this one will be considered as
         * AsyncSettled as well 
         * (as constructors itself can't have async logic)
         */
        else if (descriptor.type === DependencyDescriptorType.ClassAsync)
        {
            const dependenciesKeys = descriptor.subDependenciesKeys;
            
            if (!isSafeReference(dependenciesKeys))
                return DependenciesResolutionTraceResult.AsyncSettled;

            const result = traceDependenciesResolution
            (
                scope, 
                ...dependenciesKeys as DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
            );

            return result === DependenciesResolutionTraceResult.Async
                ? DependenciesResolutionTraceResult.Async
                : DependenciesResolutionTraceResult.AsyncSettled;
        }
        /**
         * @note It is async factory, which is Async for us in all cases,
         * because besides dependencies resolution there can be some async work in there
         */
        else
            return DependenciesResolutionTraceResult.Async;
    }
    /**
     * @note If it is not an async dependency, then its Sync by default
     */
    else
        return DependenciesResolutionTraceResult.Sync;
}

export function traceDependenciesResolution
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
(
    scope: DiScope<T_RegisteredDependencies>, 
    ...keys: T_DependencyResolutionKeys
)
    : DependenciesResolutionTraceResult
{
    return Enumerable
        .fromFactory(() => scope.registry.resolveDescriptorsByKeys(...keys))
        .aggregate<DependenciesResolutionTraceResult>
        (
            DependenciesResolutionTraceResult.Sync,
            (aggregated, descriptor) =>
            {
                const result = traceDependencyResolutionByDescriptor(scope, descriptor);

                if (result === DependenciesResolutionTraceResult.Async)
                    return Enumerable.terminateAggregation(result);
                else if (result > aggregated)
                    return result;
                else
                    return aggregated;
            }
        );
}
