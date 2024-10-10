<script setup lang="ts">
import type { Buttons } from '@/types/components/ButtonBar.ts'
import ButtonItem from '@/components/common/ButtonItem.vue'

interface Props {
  size?: number // 间距
  buttons: Buttons
}
const props = withDefaults(defineProps<Props>(), {
  size: 10
})
</script>

<template>
  <div class="button-bar">
    <div class="flex ai-start flex-wrap" :style="{ gap: `${props.size}px` }">
      <ButtonItem v-for="(item, index) in props.buttons" :key="index" :info="item" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.button-bar {
}
</style>
