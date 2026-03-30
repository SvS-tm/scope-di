import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import pkg from "./package.json" with { type: "json" };

export default defineConfig
(
    [
        {
            input: "dist/.types/index.d.ts",
            output: { file: "dist/index.d.ts", format: "es" },
            plugins: [dts({ tsconfig: "tsconfig.build.json" })],
            external: 
            [
                ...Object.keys(pkg.peerDependencies ?? {}),
                // Required for React 17+ JSX transform
                "react/jsx-runtime",
                "react/jsx-dev-runtime",
                "@svs-tm/scope-di",
                "@svs-tm/system"
            ],
        }
    ]
);
