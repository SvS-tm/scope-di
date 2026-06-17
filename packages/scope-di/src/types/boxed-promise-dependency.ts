export type BoxedPromiseDependency<T_Promise extends Promise<unknown>> =
{
    readonly promise: T_Promise;
};
