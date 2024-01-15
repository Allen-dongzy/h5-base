import type { VNode } from 'vue'

// filter配置项
export type FilterItem = CommonFilterItem & Input & Select & RangePicker

// 通用filter配置项
export interface CommonFilterItem {
  component: string,
  label?: string,
  width?: string | number,
  placeholder?: string | string[],
  key?: string,
  change?: (...args: any[]) => void
}

// 输入框
export interface Input {
  prefix?: VNode | string,
  suffix?: VNode | string,
}

// 下拉框列表项
export interface SelectOption {
  label: string,
  value: string | number,
  disabled?: boolean
}

// 下拉选择框
export interface Select {
  mode?: 'multiple' | 'tags',
  disabled?: boolean,
  loading?: boolean,
  showSearch?: boolean,
  showArrow?: boolean,
  options?: SelectOption[],
}

// 日期范围选择
export interface RangePicker extends CommonFilterItem { }

// filter配置项集合
export type Filters = Record<string, FilterItem>
