import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import pkg from "./package.json" with { type: "json" };

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
                nodeResolve({ browser: true }),
                commonjs(),
                typescript({ outputToFilesystem: true })
            ],
            external: [
                ...Object.keys(pkg.peerDependencies ?? {}),
                // Required for React 17+ JSX transform
                "react/jsx-runtime",
                "react/jsx-dev-runtime",
                "@svs-tm/scope-di",
                "@svs-tm/system"
            ],
            treeshake: true
        }
    ]
);
