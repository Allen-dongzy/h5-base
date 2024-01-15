<script setup lang="ts">
import FilterItem from '@/components/common/FilterItem.vue'
import type { Filters } from '@/types/components/FilterBar'

interface Props {
  size?: number // 间距
  query: Record<string, any>
  filters: Filters
}
const props = withDefaults(defineProps<Props>(), {
  size: 20
})
const emit = defineEmits(['update:query'])

// 查询参数
const query = computed({
  get: () => {
    return props.query
  },
  set: (val) => {
    emit('update:query', val)
  }
})

// 筛选信息
const infos = computed(() => {
  const keys = Object.keys(props.filters)
  const values = Object.values(props.filters)
  const newFilter: Filters = {}
  keys.forEach((filterKey, index) => {
    newFilter[filterKey] = {
      ...values[index],
      key: filterKey
    }
  })
  return newFilter
})
</script>

<template>
  <div class="filter-bar" :style="{ paddingBottom: size + 'px' }">
    <a-space :size="size" wrap>
      <FilterItem v-for="item in infos" v-model:query="query" :info="item" :key="item.key" />
    </a-space>
  </div>
</template>

<style scoped lang="scss">
.filter-bar {
}
</style>
