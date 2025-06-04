/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: ['jsx'],
      },
    },
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'no-unused-vars': 'warn'  // 或设置为'off'完全禁用
  },
}
