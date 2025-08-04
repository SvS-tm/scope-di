import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";

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
        typescript({ emitDeclarationOnly: true, outputToFilesystem: true })
      ],
      external: [],
    },
    {
      input: "dist/.types/index.d.ts",
      output: { file: "dist/index.d.ts", format: "es" },
      plugins: [dts()],
    }
  ]
);
