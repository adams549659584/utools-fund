import cleaner from 'rollup-plugin-cleaner';
import json from 'rollup-plugin-json';
import { version } from './package.json';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pluginConfig from './plugin.config.js';
import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';
import { terser } from "rollup-plugin-terser";

/**
 * 当前环境
 * @type {'development'|'production'}
 */
const NODE_ENV = (process.env.NODE_ENV || 'development').trim();

/** plugin.json */
pluginConfig.version = version;
const pluginJsonStr = JSON.stringify(pluginConfig);

/** 生成preload.js */
/** @type {import ('rollup').RollupOptions} */
const rollupOptions = {
  input: './src/main.ts',
  output: {
    file: './dist/preload.js',
    format: 'cjs',
    sourcemap: NODE_ENV === 'production' ? false : 'inline',
  },
  plugins: [
    cleaner({
      targets: ['dist'],
    }),
    json(),
    typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
    resolve(),
    commonjs(),
    copy({
      flatten: false,
      copyOnce: false,
      targets: [
        {
          src: 'plugin.config.js',
          dest: 'dist',
          transform: contents => pluginJsonStr,
          rename: (name, extension) => 'plugin.json',
        },
        { src: 'README.md', dest: 'dist' },
        { src: 'src/assets/**/*', dest: 'dist' },
      ],
      verbose: true,
    }),
    replace({
      ENV: JSON.stringify(NODE_ENV),
    }),
    NODE_ENV === 'production' && terser(),
  ],
};
export default rollupOptions;
