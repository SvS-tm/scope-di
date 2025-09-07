import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";

export default defineConfig
(
    [
        {
            input: "dist/.types/index.d.ts",
            output: { file: "dist/index.d.ts", format: "es" },
            plugins: [dts()],
            external: [
                ...Object.keys(pkg.peerDependencies ?? {}),
                "@svs-tm/system"
            ]
        }
    ]
);
