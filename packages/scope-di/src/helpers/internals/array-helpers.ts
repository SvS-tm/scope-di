export namespace ArrayHelpers
{
    export function reduceUntil<T_Item, T_Result>
    (
        array: T_Item[], 
        initialValue: T_Result,
        selector: (accumulator: T_Result, item: T_Item, index: number) => T_Result, 
        condition?: (accumulator: T_Result) => boolean
    )
    {
        for (let index = 0; index < array.length && (condition?.(initialValue) ?? true); ++index)
        {
            initialValue = selector(initialValue, array[index], index);
        }

        return initialValue;
    }
}
