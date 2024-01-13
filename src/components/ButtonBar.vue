<script setup lang="ts">
import type { ButtonBarProps } from '@/types/components/ButtonBar.ts'

interface Props {
  size: number // 间距
  buttons: Record<string, ButtonBarProps>
}
const props = withDefaults(defineProps<Props>(), {
  size: 10
})
</script>

<template>
  <div class="button-bar" :style="{ paddingBottom: props.size + 'px' }">
    <a-space :size="props.size" wrap>
      <a-button
        :type="item?.type"
        :size="item?.size"
        :loading="item?.loading"
        :disabled="item?.disabled"
        :icon="item?.icon"
        v-for="(item, index) in props.buttons"
        :key="index"
        @click="item?.click"
      >
        {{ item.text }}
      </a-button>
    </a-space>
  </div>
</template>

<style scoped lang="scss">
.button-bar {
  padding: 20px 0;
}
</style>
