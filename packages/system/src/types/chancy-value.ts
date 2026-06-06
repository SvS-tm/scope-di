export namespace ChancyValue
{
    const failureMarker = Symbol("ChancyValue.failure");
    const valueMarker = Symbol("ChancyValue.value");

    export type Failure = { readonly [failureMarker]: true; };
    export type Success<T_Value> = { readonly [valueMarker]: T_Value };

    export function isSuccess<T_Value>(chancyValue: ChancyValue<T_Value>): chancyValue is Success<T_Value>
    {
        return (chancyValue as unknown) !== failureMarker;
    }

    export function get<T_Value>(value: Success<T_Value>) : T_Value
    {
        return value as T_Value;
    }

    export function success<T_Value>(value: T_Value): ChancyValue<T_Value>
    {
        return value as ChancyValue<T_Value>;
    }

    export function failure<T_Value>(): ChancyValue<T_Value>
    {
        return failureMarker as unknown as ChancyValue<T_Value>;
    }
}

export type ChancyValue<T_Value> = ChancyValue.Success<T_Value> | ChancyValue.Failure;
