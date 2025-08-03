export const isNotSafeReference = <T_Reference>(value: T_Reference | null | undefined): value is (null | undefined) =>
{
    return value === undefined || value === null;
};
