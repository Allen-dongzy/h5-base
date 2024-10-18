<script setup lang="ts">
import type { FilterItem } from '@/types/components/FilterBar'
import useAppStore from '@/stores/useAppStore'

interface Props {
  query: Record<string, any>
  info: FilterItem
}

const props = defineProps<Props>()
const emit = defineEmits(['update:query'])

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

// 查询参数
const query = computed({
  get: () => {
    return props.query
  },
  set: (val) => {
    emit('update:query', val)
  }
})
</script>

<template>
  <a-space class="filter-item" :direction="isMobile ? 'vertical' : 'horizontal'" :size="10">
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
      <a-select
        v-if="props.info.component === 'select'"
        ref="select"
        :style="{ width: props.info?.width ? `${props.info?.width}px` : '120px' }"
        v-model:value="query[props.info?.key as string]"
        :mode="props.info?.mode"
        :disabled="props.info?.disabled"
        :loading="props.info?.loading"
        :showSearch="props.info?.showSearch"
        :showArrow="props.info?.showArrow"
        :placeholder="props.info?.placeholder"
        allow-clear
        @change="props.info?.change"
      >
        <a-select-option v-for="item in props.info?.options" :value="item.value" :key="item.value">
          {{ item.label }}
        </a-select-option>
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
  </a-space>
</template>

<style scoped lang="scss">
.filter-item {
  .addon {
    font-size: 12px;
    color: #999999;
  }
}
</style>
