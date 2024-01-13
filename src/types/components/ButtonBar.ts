import type { VNode } from 'vue'

export interface ButtonBarProps {
  text: string,
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text',
  size?: 'large' | 'middle' | 'small',
  loading?: boolean,
  disabled?: boolean,
  icon?: VNode,
  click?: (...args: any[]) => void
}