/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    '@vue/eslint-config-typescript'
    // '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'multiline-ternary': 'off',
    camelcase: 0,
    'no-empty': ['off', { allowEmptyCatch: true }],
    indent: [
      'error',
      2,
      {
        // ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute']
      }
    ],
    // 缩进空格2
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    // 第二个属性开始换行
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'beside'
    }],
    // 标签关闭的> 是否换行~
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    // 组件名必须key-xxx形式
    // "vue/component-definition-name-casing": "kebab-case",

    // 检查props默认值，关闭
    'vue/require-default-prop': 0,
    // 子组件传参规则，关闭
    'vue/attribute-hyphenation': 0,
    'vue/multi-word-component-names': 0,
    'vue/valid-v-for': 0,
    'vue/no-multiple-template-root': 0
  }
}
