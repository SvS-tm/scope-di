import { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { createContext } from "react";

export const resolutionScopeContext = createContext<DiScope<RegisteredDependencies> | null>(null);
