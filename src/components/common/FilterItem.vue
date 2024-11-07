<script setup lang="ts">
import type { FilterItem, SelectOption } from '@/types/components/FilterBar'
import useAppStore from '@/stores/useAppStore'

interface Props {
  query: Record<string, any>
  info: FilterItem
}

const props = defineProps<Props>()
const emit = defineEmits(['update:query'])

const appStore = useAppStore()
const { isMobile, isDesktop } = storeToRefs(appStore)

// 查询参数
const query = computed({
  get: () => {
    return props.query
  },
  set: (val) => {
    emit('update:query', val)
  }
})

// 默认过滤选项
const defaultFilterOption = (input: string, option: SelectOption) => {
  const label = props.info?.options?.find((item) => item.value === option.value)?.label
  if (!label) return false
  return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
</script>

<template>
  <div
    class="filter-item"
    :class="{ 'flex flex-col': isMobile, 'flex ai-start': isDesktop }"
    :style="{ gap: `${10}px` }"
  >
    <div class="title" v-if="props.info?.label">{{ props.info?.label }}：</div>
    <div class="value">
      <!-- 输入框 -->
      <a-input
        v-if="props.info.component === 'input'"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : 'auto' }"
        v-model:value="query[props.info?.key as string]"
        :placeholder="props.info?.placeholder"
        allow-clear
        @change="props.info?.change"
      >
        <template #prefix v-if="props.info?.prefix">
          <span v-if="typeof props.info?.prefix === 'string'">{{ props.info?.prefix }}</span>
          <component v-else :is="props.info?.prefix"></component>
        </template>
        <template #suffix v-if="props.info?.suffix">
          <span v-if="typeof props.info?.suffix === 'string'">{{ props.info?.suffix }}</span>
          <component v-else :is="props.info?.suffix"></component>
        </template>
      </a-input>

      <!-- 文本框 -->
      <a-textarea
        v-if="props.info.component === 'textarea'"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : 'auto' }"
        v-model:value="query[props.info?.key as string]"
        :placeholder="props.info?.placeholder"
        allow-clear
        @change="props.info?.change"
      />

      <!-- 数字输入框 -->
      <a-input-number
        v-if="props.info.component === 'input-number'"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : 'auto' }"
        v-model:value="query[props.info?.key as string]"
        @change="props.info?.change"
      >
        <template #prefix v-if="props.info?.prefix">
          <span v-if="typeof props.info?.prefix === 'string'">{{ props.info?.prefix }}</span>
          <component v-else :is="props.info?.prefix"></component>
        </template>
        <template #suffix v-if="props.info?.suffix">
          <span v-if="typeof props.info?.suffix === 'string'">{{ props.info?.suffix }}</span>
          <component v-else :is="props.info?.suffix"></component>
        </template>
        <template #addonBefore v-if="props.info?.addonBefore">
          <span v-if="typeof props.info?.addonBefore === 'string'" class="addon">{{
            props.info?.addonBefore
          }}</span>
          <component v-else :is="props.info?.addonBefore"></component>
        </template>
        <template #addonAfter v-if="props.info?.addonAfter">
          <span v-if="typeof props.info?.addonAfter === 'string'" class="addon">{{
            props.info?.addonAfter
          }}</span>
          <component v-else :is="props.info?.addonAfter"></component>
        </template>
      </a-input-number>

      <!-- 下拉选择框 -->
      <!-- 使用search以及select配合laoding的时候记得关闭filterOption,否则会同时进行本地抖索 -->
      <a-select
        v-if="props.info.component === 'select'"
        ref="select"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : '120px' }"
        v-model:value="query[props.info?.key as string]"
        :mode="props.info?.mode"
        :disabled="props.info?.disabled"
        :showSearch="props.info?.showSearch"
        :searchValue="props.info?.searchValue"
        :filterOption="props.info?.filterOption || defaultFilterOption"
        :showArrow="props.info?.showArrow"
        :placeholder="props.info?.placeholder"
        :maxTagCount="props.info?.maxTagCount || 2"
        allow-clear
        :options="props.info?.options"
        @change="props.info?.change"
        @search="props.info?.search"
        @select="props.info?.select"
      >
        <template v-if="props.info?.loading" #notFoundContent>
          <a-spin size="small" />
        </template>
      </a-select>

      <!-- 日期范围 -->
      <a-range-picker
        v-if="props.info.component === 'range-picker'"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : 'auto' }"
        v-model:value="query[props.info?.key as string]"
        :placeholder="props.info?.placeholder"
        allow-clear
        :format="props.info?.format"
        :show-time="props.info?.showTime"
        :disabled-date="props.info?.disabledDate"
        @calendar-change="props.info?.calendarChange"
        @change="props.info?.change"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-item {
  .title {
    line-height: 32px;
  }
  .addon {
    font-size: 12px;
    color: #999999;
  }
}
</style>
