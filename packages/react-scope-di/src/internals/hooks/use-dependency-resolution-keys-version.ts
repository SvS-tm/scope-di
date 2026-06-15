import { DependencyMappingKey, DependencyResolutionKey } from "@svs-tm/scope-di";
import { RegisteredDependencies } from "@svs-tm/scope-di";
import { useRef } from "react";

type KeysState =
{
    keys: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>[]; 
    version: number;
};

export function useDependencyResolutionKeysVersion(keys: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>[])
{
    const state = useRef<KeysState>(undefined);

    if(!state.current)
        state.current = { keys, version: 0 };
    
    else if(!DependencyResolutionKey.equalRange(state.current.keys, keys))
        state.current = { keys, version: state.current.version + 1 };

    return state.current.version;
}
