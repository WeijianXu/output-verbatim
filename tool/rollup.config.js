import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
// import dts from 'rollup-plugin-dts';

import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

// const glob = require('glob');
const { pathJoin } = require('./utils');
const { name } = require('../package.json');

const baseExtensions = ['.ts', '.tsx', '.js', '.jsx'/* , '.vue' */];

const baseConfig = {
  input: 'src/index.ts',

  external: ['markdown-it'],
};

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  'markdown-it': 'markdownit'
};

const pluginsPre = [
  resolve({ browser: true, preferBuiltins: false }), // 插件允许加载第三方模块
  commonjs(), // 插件将它们转换为ES6版本
  json(),
  //  TODO 设置路径别名，在 vue 文件 style 中没有生效
  alias({
    entries: [
      {
        find: '@',
        replacement: pathJoin('src'),
        // OR place `customResolver` here. See explanation below.
      },
    ],
    customResolver: resolve({
      extensions: [...baseExtensions],
    }),
  }),
  // 解析 typescript 语法
  typescript({
    tsconfig: false,
    module: 'es2015',
  }),
];

const esConfig = {
  ...baseConfig,
  input: {
    index: pathJoin('src/index.ts'),
  },
  output: {
    format: 'esm',
    exports: 'named',
    dir: 'dist/es',
    // assetFileNames: '[name][extname]',
  },
  plugins: [
    // 清除上一次编译文件
    del({ targets: ['dist/es/*'] }),
    ...pluginsPre,

    // 清除多余空格、空行等
    cleanup(),
  ],
};

// # compile to a CommonJS module ('cjs')
const cjsConfig = {
  ...baseConfig,
  output: {
    // compact: true,
    file: `dist/${name}.cjs.js`,
    format: 'cjs',
    name,
    exports: 'named',
    globals,
  },
  plugins: [
    // 清除上一次编译文件
    del({ targets: `dist/${name}.cjs.js` }),
    ...pluginsPre,

    // 清除多余空格、空行等
    /* terser({
      mangle: {
        keep_classnames: true,
      },
      keep_classnames: true, // 组件 class 名保留
    }), */
    cleanup(),
  ],
};

// cdn 使用
const unpkgConfig = {
  ...baseConfig,
  output: {
    // compact: true,
    file: `dist/${name}.min.js`,
    format: 'iife',
    name,
    exports: 'named',
    extend: true,
    globals,
  },
  plugins: [
    // 清除上一次编译文件
    del({ targets: `dist/${name}.min.js` }),
    ...pluginsPre,

    // 清除多余空格、空行等
    terser({
      ecma: 5,
      keep_classnames: true, // 组件 class 名保留
      keep_fnames: true,
    }),
    cleanup(),
  ],
};

export default [esConfig, cjsConfig, unpkgConfig];
