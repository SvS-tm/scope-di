/**
 * This helper method is intended to be used with
 * `??` operator as a return type.
 *
 * Example:
 * `() => value ?? throwError("Failure!")`
 * @param error Error to throw
 */
export declare const throwError: <T_Result>(error: unknown) => T_Result;
