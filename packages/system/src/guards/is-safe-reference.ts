export const isSafeReference = <T_Reference>(value: T_Reference | null | undefined): value is NonNullable<T_Reference> =>
{
    return value !== undefined && value !== null;
};
