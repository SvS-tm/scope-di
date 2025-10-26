export class NotExpectedResultTypeError extends Error
{
    public constructor(result: unknown)
    {
        super
        (
            `Can not await value that is not returned from useDependenciesAsync hook!`, 
            { cause: result }
        );
    }
}
