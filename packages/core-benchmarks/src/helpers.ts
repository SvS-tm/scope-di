import { do_not_optimize } from "mitata";

export function *createWarmResolutionBenchmark<TContainer>(container: TContainer, resolve: (container: TContainer) => unknown)
{
    resolve(container);

    yield () => do_not_optimize(resolve(container));
}

export function *createColdResolutionBenchmark<TContainer>(createContainer: () => TContainer, resolve: (container: TContainer) => unknown)
{
    yield {
        [0]: createContainer,

        bench(container: TContainer)
        {
            do_not_optimize(resolve(container));
        }
    };
}
