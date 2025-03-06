module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 限制 type 的可选值，必须与 cz.config.js 保持一致
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'adjust',
        'fix',
        'style',
        'refactor',
        'chore',
        'build',
        'docs',
        'perf',
        'test',
        'revert'
      ]
    ],

    // 限制 scope 的可选值，必须与 cz.config.js 保持一致
    'scope-enum': [
      2,
      'always',
      ['pages', 'components', 'utils', 'api', 'styles', 'deps', 'config']
    ],

    // type,scope,subject 不能为空
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],

    // 限制 subject 的大小写格式
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'lower-case']],

    // 限制 subject 最长 100 个字符
    'header-max-length': [2, 'always', 100],

    // 允许 body 和 footer 的换行符（与 cz-config.js `breaklineChar: "|"` 一致）
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'body-max-line-length': [0, 'always', 'Infinity'],
    'footer-max-line-length': [0, 'always', 'Infinity']
  }
}
