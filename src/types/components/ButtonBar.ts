import type { VNode } from 'vue'

// button配置项
export interface ButtonItem {
  text: string,
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text',
  size?: 'large' | 'middle' | 'small',
  loading?: boolean,
  disabled?: boolean,
  icon?: VNode,
  click?: (...args: any[]) => void
}

// button配置项集合
export type Buttons = Record<string, ButtonItem>
