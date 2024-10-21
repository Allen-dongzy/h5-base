import type { VNode } from 'vue'
import type { Dayjs } from 'dayjs'

// filter组件名称
export type FilterName = 'input' | 'textarea' | 'input-number' | 'select' | 'range-picker'

// filter配置项
export type FilterItem = CommonFilterItem & Input & Textarea & InputNumber & Select & RangePicker

// 通用filter配置项
export interface CommonFilterItem {
  component: FilterName,
  label?: string,
  width?: string | number,
  placeholder?: string | string[],
  key?: string,
  change?: (...args: any[]) => void
}

// 输入框
export interface Input {
  prefix?: VNode | string
  suffix?: VNode | string
}

// 文本框
export interface Textarea extends Input {
}

// 数字输入框
export interface InputNumber extends Input {
  addonBefore?: VNode | string
  addonAfter?: VNode | string
}

// 下拉框列表项
export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

// 下拉选择框
export interface Select {
  mode?: 'multiple' | 'tags'
  disabled?: boolean
  loading?: boolean
  showSearch?: boolean
  showArrow?: boolean
  options?: SelectOption[]
}

// 日期范围选择
export interface RangePicker extends CommonFilterItem {
  format?: string
  showTime?: boolean
  disabledDate?: (day: Dayjs) => boolean
  calendarChange?: (days: [Dayjs, Dayjs]) => void
}

// filter配置项集合
export type Filters = Record<string, FilterItem>
