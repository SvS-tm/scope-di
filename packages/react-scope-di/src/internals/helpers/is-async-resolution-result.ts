import type { AsyncResolutionResult } from "../../types/async-resolution-result";
import { asyncResolutionResultMarker } from "../constants/is-async-resolution-result";

export const isAsyncResultionResult = (value: unknown): value is AsyncResolutionResult<any, any> =>
{
    return value instanceof Promise && (value as any)[asyncResolutionResultMarker] === true;
};
