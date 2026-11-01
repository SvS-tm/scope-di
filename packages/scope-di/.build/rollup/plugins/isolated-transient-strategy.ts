import type { Plugin } from "rollup";

let isolatedEsmFileName: string | undefined;

export function emitIsolatedTransientStrategyModule(format: "esm" | "cjs"): Plugin
{
    const virtualId = "virtual:isolated-transient-strategy-module-path";
    const resolvedId = `\0${virtualId}`;
    let referenceId: string | undefined;

    const plugin: Plugin =
    {
        name: "emit-isolated-transient-strategy-module",
        buildStart()
        {
            if (format === "esm")
            {
                referenceId = this.emitFile
                (
                    {
                        type: "chunk",
                        id: "src/internals/instantiation-strategies/strategies/isolated-transient-strategies.ts",
                        name: "isolated-transient-strategies",
                        preserveSignature: "strict"
                    }
                );
            }
        },
        resolveId(source)
        {
            if (source === virtualId)
                return resolvedId;

            return null;
        },
        load(id)
        {
            if (id !== resolvedId)
                return;

            // CommonJS imports the ESM chunk emitted by the preceding build.
            if (format === "cjs")
            {
                if (isolatedEsmFileName === undefined)
                    this.error("Build the ESM strategy chunk before the CommonJS output.");

                return `export const isolatedTransientStrategyModulePath = ${JSON.stringify(`./${isolatedEsmFileName}`)};`;
            }

            return `export const isolatedTransientStrategyModulePath = import.meta.ROLLUP_FILE_URL_${referenceId};`;
        },
        resolveFileUrl({ referenceId: requestedId, relativePath })
        {
            if (requestedId === referenceId)
                // Preserve relative native imports: Bun's file-URL query probe reused module instances.
                return JSON.stringify(relativePath.startsWith(".") ? relativePath : `./${relativePath}`);

            return null;
        },
        generateBundle()
        {
            if (format === "esm" && referenceId !== undefined)
                isolatedEsmFileName = this.getFileName(referenceId);
        }
    };

    return plugin;
}
