import { do_not_optimize } from "mitata";

export function *createWarmResolutionBenchmark<T_Container>
(
    container: T_Container,
    resolve: (container: T_Container) => unknown
)
{
    resolve(container);

    yield () => do_not_optimize(resolve(container));
}

export function *createColdResolutionBenchmark<T_Container>
(
    createContainer: () => T_Container,
    resolve: (container: T_Container) => unknown,
    cleanupContainer?: (container: T_Container) => void
)
{
    let previousContainer: T_Container | undefined;

    yield {
        [0]()
        {
            if (previousContainer)
                cleanupContainer?.(previousContainer);

            previousContainer = createContainer();

            return previousContainer;
        },

        bench(container: T_Container)
        {
            do_not_optimize(resolve(container));
        }
    };
}
