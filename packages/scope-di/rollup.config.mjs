import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default defineConfig
(
  [
    {
      input: 'src/index.ts',
      output: [
        { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
        { file: 'dist/index.cjs', format: 'cjs', sourcemap: true }
      ],
      plugins: [
        resolve(), 
        commonjs(), 
        typescript({ tsconfig: './tsconfig.json', declaration: false, outputToFilesystem: true })
      ],
      external: [],
    },
    {
      input: 'src/index.ts',
      output: { file: 'dist/index.d.ts', format: 'es' },
      plugins: [dts()],
    }
  ]
);
