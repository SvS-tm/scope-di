import { do_not_optimize } from "mitata";

export function *createWarmResolutionBenchmark<TContainer>(container: TContainer, resolve: (container: TContainer) => unknown)
{
    resolve(container);

    yield () => do_not_optimize(resolve(container));
}

export function *createColdResolutionBenchmark<TContainer>
(
    createContainer: () => TContainer,
    resolve: (container: TContainer) => unknown,
    cleanupContainer?: (container: TContainer) => void
)
{
    let previousContainer: TContainer | undefined;

    yield {
        [0]()
        {
            if(previousContainer)
                cleanupContainer?.(previousContainer);

            previousContainer = createContainer();

            return previousContainer;
        },

        bench(container: TContainer)
        {
            do_not_optimize(resolve(container));
        }
    };
}
