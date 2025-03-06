module.exports = {
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'adjust', name: 'adjust: 调整功能' },
    { value: 'fix', name: 'fix: 修复bug' },
    { value: 'style', name: 'style: 代码样式改动' },
    { value: 'refactor', name: 'refactor: 代码重构' },
    { value: 'chore', name: 'chore: 其他无关逻辑的修改' },
    { value: 'build', name: 'build: 项目整体配置的修改（如构建工具、依赖更新等）' },
    { value: 'docs', name: 'docs: 修改文档' },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 添加或修改测试代码' },
    { value: 'revert', name: 'revert: 回滚 commit' }
  ],
  scopes: [
    { name: 'pages' },
    { name: 'components' },
    { name: 'utils' },
    { name: 'api' },
    { name: 'styles' },
    { name: 'deps' },
    { name: 'config' }
  ],
  messages: {
    type: '请选择提交类型:',
    scope: '请选择修改的范围（可选）:',
    customScope: '请输入自定义修改范围:\n',
    subject: '请简要描述提交 (必填):\n',
    body: '请输入详细描述（可选）。使用 "|" 换行:\n',
    breaking: '列举非兼容性重大的变更 (可选)。使用 "|" 换行 :\n',
    footer: '输入关闭的 issue（可选）。如: #31, #42:\n',
    confirmCommit: '确定提交信息无误？'
  },
  // 跳过customScope
  allowCustomScopes: false,
  // 设置只有type选择了feat或fix，才询问breaking
  allowBreakingChanges: ["feat", "fix"],
  // 跳过要询问的步骤
  skipQuestions: ["customScope", "body", "footer"],
  // subject 限制长度
  subjectLimit: 100,
  // 支持 body 和 footer
  breaklineChar: "|", 
}
