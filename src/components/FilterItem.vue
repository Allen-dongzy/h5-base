<script setup lang="ts">
import type { Dayjs } from 'dayjs'

type RangeValue = [Dayjs, Dayjs]
const value1 = ref<RangeValue>()
</script>

<template>
  <a-space class="filter-item" :size="10">
    <div class="title">对话时间</div>
    <div class="value">
      <a-range-picker v-model:value="value1" />
    </div>
  </a-space>
</template>

<style scoped lang="scss">
.filter-item {
}
</style>
