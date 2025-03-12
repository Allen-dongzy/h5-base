/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier',
    './presets/auto-import/.eslintrc-auto-import.json' // 防止unplugin-auto-import自动导入和eslint规则冲突
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }], // 优先使用单引号
    'jsx-quotes': ['error', 'prefer-single'], // 在jsx中使用单引号
    semi: ['error', 'never'], // 结尾没有分号
    'comma-dangle': ['error', 'never'], // 对象中最后一个属性的结尾没有逗号
    '@typescript-eslint/no-var-requires': 0, // 在ts中使用require
    '@typescript-eslint/no-explicit-any': 0, // 允许使用any类型
    '@typescript-eslint/no-empty-interface': 0, // 允许声明空的interface
    '@typescript-eslint/no-non-null-assertion': 0, // 允许非空断言
    'vue/multi-word-component-names': 0 // 允许vue组件单个单词来命名
  }
}
