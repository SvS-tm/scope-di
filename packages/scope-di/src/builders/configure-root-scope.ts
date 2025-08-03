import type { DiScopeBuilder } from "./abstractions";
import { DefaultDiScopeBuilder } from "./internals/default-di-scope-builder";

export const configureRootScope = (): DiScopeBuilder =>
{
    return new DefaultDiScopeBuilder();
};
