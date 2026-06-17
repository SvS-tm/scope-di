import type { BoxedPromiseDependency } from "../../types/boxed-promise-dependency";

export function createBoxedPromiseDependency<T_Promise extends Promise<unknown>>
(
    promise: T_Promise
)
    : BoxedPromiseDependency<T_Promise>
{
    return { promise };
}
