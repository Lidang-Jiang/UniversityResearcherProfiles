module.exports = {
  root: true,
  defaultSeverity: 'error',
  plugins: ['stylelint-order'],
  extends: [
    'stylelint-config-standard', // the standard shareable config for Stylelint
    'stylelint-config-html/html', // the shareable html config for Stylelint.
    'stylelint-config-html/vue', // the shareable vue config for Stylelint.
    'stylelint-config-recess-order', // use the clean order for properties
    'stylelint-config-prettier', // turn off any rules that conflict with Prettier
    'stylelint-config-recommended-scss',
  ],
  rules: {
    // 禁止在覆盖高特异性选择器之后出现低特异性选择器
    'no-descending-specificity': null,
    // 禁止空源码
    'no-empty-source': null,
    // 禁止字体族中缺少泛型族关键字
    'font-family-no-missing-generic-family-keyword': null,
    // 禁止未知的@规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'else',
          'each',
          'include',
          'mixin',
          'extend',
          'for',
          'use',
        ],
      },
    ],
    // 指定@规则名的大小写
    'at-rule-name-case': 'lower',
    // 不允许未知函数
    'function-no-unknown': null,
    // 不允许未知单位
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    // 不允许选择器使用供应商前缀
    'selector-no-vendor-prefix': null,
    // 指定关键帧名称的模式
    'keyframes-name-pattern': null,
    // 指定类选择器的模式
    'selector-class-pattern': null,
    // 不允许值使用供应商前缀
    'value-no-vendor-prefix': null,
    // 要求或禁止在规则之前的空行
    'rule-empty-line-before': ['always', { ignore: ['after-comment', 'first-nested'] }],
    // 指定字符串使用单引号
    'string-quotes': 'single',
    // 指定@import 样式的规则
    'import-notation': 'string',
    // 指定缩进
    indentation: [2, { severity: 'warning' }],
    // 允许使用 :deep()
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
  overrides: [
    {
      files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
      customSyntax: 'postcss-html',
      rules: {
        // 禁止未知的伪类选择器
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep', 'global'] }],
        // 禁止未知的伪元素选择器
        'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'] }],
      },
    },
  ],
}
