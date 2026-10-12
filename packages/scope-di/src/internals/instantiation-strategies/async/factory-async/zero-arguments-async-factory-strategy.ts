import { TrackedPromise } from "@svs-tm/system";
import { DependencyFactory } from "../../../../types/dependency-factory";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncFactoryStrategy
<
    T_Factory extends DependencyFactory<any[], Promise<any>>
>
(
    factory: T_Factory
)
    : InstantiationStrategy<Promise<Awaited<ReturnType<T_Factory>>>>
{
    /**
     * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
     * So lets just track it
     */
    return () => TrackedPromise.track(factory());
}

