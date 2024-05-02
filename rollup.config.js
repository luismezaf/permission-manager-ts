import dts from "rollup-plugin-dts";
import { uglify } from "rollup-plugin-uglify";

const config = [{
  input: './dist/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'auto',
  },
  plugins: [uglify()]
}, {
  input: './dist/index.d.ts',
  output: {
    file: './dist/index.d.ts',
    format: 'es'
  },
  plugins: [dts()]
}];
export default config;