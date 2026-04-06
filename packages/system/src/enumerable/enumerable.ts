import { AggregationResult } from "./aggregation-result";
import { AggregationTerminator } from "./aggregation-terminator";
import { aggregationTerminatorMarker } from "./internals/aggregation-terminator-marker";

export class Enumerable<T_Item>
{
    private constructor
    (
        private readonly iterableFactory: () => Iterable<T_Item>
    )
    {
    }

    public static terminateAggregation<T_Aggregated>(aggregated: T_Aggregated) : AggregationTerminator<T_Aggregated>
    {
        return { [aggregationTerminatorMarker]: true, aggregated };
    }

    private static isAggregationTerminator(result: unknown) : result is AggregationTerminator<unknown>
    {
        return (
            typeof result === "object"
                && 
            result !== null
                && 
            aggregationTerminatorMarker in result
        );
    }

    public aggregate<T_Aggregated>
    (
        initial: T_Aggregated,
        aggregator: (aggregated: T_Aggregated, item: T_Item, index: number) => AggregationResult<T_Aggregated>
    )
        : T_Aggregated
    {
        let index = 0;

        for (const item of this)
        {
            const result = aggregator(initial, item, index++);

            if (Enumerable.isAggregationTerminator(result))
                return result.aggregated;

            initial = result;
        }

        return initial;
    }

    private *createWhereIterable
    (
        predicate: (item: T_Item, index: number) => boolean
    )
        : Iterable<T_Item>
    {
        let index = 0;

        for (const item of this)
        {
            if (predicate(item, index++))
                yield item;
        }
    }

    public where<T_Filtered extends T_Item>
    (
        predicate: (item: T_Item, index: number) => item is T_Filtered
    )
        : Enumerable<T_Filtered>;

    public where
    (
        predicate: (item: T_Item, index: number) => boolean
    )
        : Enumerable<T_Item>;

    public where<T_Filtered extends T_Item>
    (
        predicate: 
        (
            ((item: T_Item, index: number) => boolean) 
                |
            ((item: T_Item, index: number) => item is T_Filtered)
        )
    )
        : Enumerable<T_Item> | Enumerable<T_Filtered>
    {
        return Enumerable.fromFactory(() => this.createWhereIterable(predicate));
    }

    private *createSelectIterable<T_Selected>
    (
        selector: (item: T_Item, index: number) => T_Selected
    ) 
        : Iterable<T_Selected>
    {
        let index = 0;

        for (const item of this)
            yield selector(item, index++);
    }

    public select<T_Selected>
    (
        selector: (item: T_Item, index: number) => T_Selected
    ) 
        : Enumerable<T_Selected>
    {
        return Enumerable.fromFactory(() => this.createSelectIterable(selector));
    }

    public toArray(): T_Item[] 
    {
        return [...this];    
    }

    public [Symbol.iterator](): Iterator<T_Item>
    {
        return this.iterableFactory()[Symbol.iterator]();
    }

    public static fromIterable<T_Item>(iterable: Iterable<T_Item>): Enumerable<T_Item>
    {
        return Enumerable.fromFactory(() => iterable);
    }

    public static fromFactory<T_Item>(factory: () => Iterable<T_Item>): Enumerable<T_Item>
    {
        return new Enumerable(factory);
    }
}
