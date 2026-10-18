import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import pkg from "./package.json" with { type: "json" };

let isolatedEsmFileName;

function emitIsolatedTransientStrategyModule(format)
{
    const virtualId = "virtual:isolated-transient-strategy-module-path";
    const resolvedId = `\0${virtualId}`;
    let referenceId;

    return {
        name: "emit-isolated-transient-strategy-module",
        buildStart()
        {
            if (format === "esm")
                referenceId = this.emitFile
                ({
                    type: "chunk",
                    id: "src/internals/instantiation-strategies/strategies/isolated-transient-strategies.ts",
                    name: "isolated-transient-strategies",
                    preserveSignature: "strict"
                });
        },
        resolveId(source)
        {
            if (source === virtualId)
                return resolvedId;
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
        },
        generateBundle()
        {
            if (format === "esm")
                isolatedEsmFileName = this.getFileName(referenceId);
        }
    };
}

export default defineConfig
(
    [
        ...["esm", "cjs"].map(format => ({
            input: { index: "src/index.ts" },
            output: 
            [
                {
                    dir: "dist",
                    format: "esm",
                    entryFileNames: "[name].mjs",
                    chunkFileNames: "chunks/[name]-[hash].mjs",
                    sourcemap: true
                },
                {
                    dir: "dist",
                    format: "cjs",
                    entryFileNames: "[name].cjs",
                    chunkFileNames: "chunks/[name]-[hash].cjs",
                    sourcemap: true
                }
            ].filter(output => output.format === format),
            plugins: 
            [
                emitIsolatedTransientStrategyModule(format),
                nodeResolve(),
                commonjs(),
                typescript
                (
                    { 
                        tsconfig: "tsconfig.build.json",
                        noEmitOnError: true, 
                        outputToFilesystem: true 
                    }
                )
            ],
            external: 
            [
                ...Object.keys(pkg.peerDependencies ?? {}),
                ...Object.keys(pkg.dependencies ?? {})
            ]
        }))
    ]
);
