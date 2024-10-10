<script setup lang="ts">
import type { ButtonItem } from '@/types/components/ButtonBar.ts'

interface Props {
  info: ButtonItem
}
const props = defineProps<Props>()
</script>

<template>
  <div class="button-item">
    <a-button
      :type="props.info?.type"
      :size="props.info?.size"
      :loading="props.info?.loading"
      :disabled="props.info?.disabled"
      :icon="props.info?.icon"
      @click="props.info?.click"
    >
      {{ props.info.text }}
    </a-button>
  </div>
</template>

<style scoped lang="scss">
.button-item {
}
</style>
