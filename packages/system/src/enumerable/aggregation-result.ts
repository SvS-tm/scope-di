import { AggregationTerminator } from "./aggregation-terminator";

export type AggregationResult<T_Aggregated> = T_Aggregated | AggregationTerminator<T_Aggregated>;
