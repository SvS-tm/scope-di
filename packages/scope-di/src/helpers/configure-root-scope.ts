import type { DiScopeBuilder } from "../abstractions";
import { DefaultDiScopeBuilder } from "../internals/builders/default-di-scope-builder";

export const configureRootScope = (): DiScopeBuilder =>
{
    return new DefaultDiScopeBuilder();
};
