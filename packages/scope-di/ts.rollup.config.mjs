import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig
(
    [
        {
            input: "src/index.ts",
            output: [
                { file: "dist/index.mjs", format: "esm", sourcemap: true },
                { file: "dist/index.cjs", format: "cjs", sourcemap: true }
            ],
            plugins: [
                nodeResolve(),
                commonjs(),
                typescript({ outputToFilesystem: true })
            ],
            external: [
                ...Object.keys(pkg.peerDependencies ?? {}),
                "@svs-tm/system"
            ]
        }
    ]
);
