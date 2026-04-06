import { aggregationTerminatorMarker } from "./internals/aggregation-terminator-marker";

export type AggregationTerminator<T_Aggregated> = 
{
    readonly [aggregationTerminatorMarker]: true;
    readonly aggregated: T_Aggregated;
};
