<script setup lang="ts">
import FilterItem from '@/components/FilterItem.vue'

// 间距
const size = ref(20)
</script>

<template>
  <div class="filter-bar" :style="{ paddingBottom: size + 'px' }">
    <a-space :size="size" wrap>
      <FilterItem />
      <FilterItem />
      <FilterItem />
      <FilterItem />
      <FilterItem />
    </a-space>
  </div>
</template>

<style scoped lang="scss">
.filter-bar {
}
</style>
