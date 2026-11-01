import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig, type RollupOptions, type OutputOptions } from "rollup";
import pkg from "../../package.json" with { type: "json" };

import { emitIsolatedTransientStrategyModule } from "./plugins/isolated-transient-strategy";

export default defineConfig
(
    (["esm", "cjs"] as const).map
    (
        (format): RollupOptions =>
        (
            {
                input: { index: "src/index.ts" },
                output:
                (
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
                    ] satisfies OutputOptions[]
                )
                    .filter(output => output.format === format),
                plugins:
                [
                    emitIsolatedTransientStrategyModule(format),
                    nodeResolve(),
                    commonjs(),
                    typescript
                    (
                        {
                            tsconfig: ".build/tsconfig.build.json",
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
            }
        )
    )
);
