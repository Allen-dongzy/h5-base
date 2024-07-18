<script setup lang="ts">
import FilterBar from '@/components/common/FilterBar.vue'
import ButtonBar from '@/components/common/ButtonBar.vue'
import type { Buttons } from '@/types/components/ButtonBar'
import type { Filters } from '@/types/components/FilterBar'

interface Props {
  size?: number // 间距
  query: Record<string, any>
  filters: Filters
  buttons?: Buttons
}

const props = withDefaults(defineProps<Props>(), {
  size: 10
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
</script>

<template>
  <div class="filter-area flex jc-sb">
    <FilterBar v-model:query="query" :filters="props.filters" :size="props?.size" />
    <div class="flex jc-end flex-shrink" v-if="props.buttons">
      <ButtonBar :buttons="props.buttons" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-area {
  width: 100%;
}
</style>
