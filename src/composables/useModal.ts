import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

// 配置约束
interface Options {
  title: string
  icon: any
  content: string
  okText: string
  cancelText: string
  confirm: () => void
}

// 默认配置
const defaultOptions: Partial<Options> = {
  title: '提示',
  icon: ExclamationCircleOutlined,
  content: '是否执行该操作?',
  okText: '确定',
  cancelText: '取消',
  confirm: () => { }
}

export default (options?: Partial<Options>) => {
  options = options || defaultOptions

  // 确认框
  const confirmModal = (options?: Partial<Options>) => {
    options = Object.assign({}, defaultOptions, options)
    Modal.confirm({
      title: options.title,
      icon: createVNode(options.icon),
      content: createVNode('div', { style: 'font-size:14px;' }, options.content),
      okText: options.okText,
      cancelText: options.cancelText,
      onOk: async () => {
        if (!options?.confirm) return Promise.resolve()
        return options?.confirm()
      }
    })
  }

  return { confirmModal }
}