import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
import { uglify } from "rollup-plugin-uglify";

const config = [{
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'auto',
  },
  plugins: [typescript(), uglify()]
}, {
  input: './types/index.d.ts',
  output: {
    file: './dist/index.d.ts',
    format: 'es'
  },
  plugins: [dts()]
}];
export default config;