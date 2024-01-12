import type { ItemType } from 'ant-design-vue'
import type { VNode } from 'vue'

// 菜单类型
export interface Menu {
  key: string
  icon?: () => VNode
  label: string
  title: string
  children?: Menu[]
}

// 菜单点击事件类型
export interface MenuEvent {
  item: ItemType
  key: string
  keyPath: string[]
}