<script setup lang="ts" name="example">
import FilterBar from '@/components/FilterBar.vue'
import ButtonBar from '@/components/ButtonBar.vue'
import type { ButtonBarProps } from '@/types/components/ButtonBar'
import { PieChartOutlined } from '@ant-design/icons-vue'

const route = useRoute()

// 路径
const path = computed(() => route.fullPath)
// 按钮
const buttons = reactive<Record<string, ButtonBarProps>>({
  add: {
    text: '新增',
    type: 'primary',
    icon: h(PieChartOutlined),
    disabled: false,
    click: () => {
      console.log('新增')
      buttons.add.disabled = true
      setTimeout(() => {
        buttons.add.disabled = false
      }, 2000)
    }
  },
  delete: {
    text: '删除',
    loading: false,
    click: () => {
      console.log('删除')
      buttons.delete.loading = true
      setTimeout(() => {
        buttons.delete.loading = false
      }, 2000)
    }
  }
})
</script>

<template>
  <div class="example">
    <div class="text">example: {{ path }}</div>
    <FilterBar />
    <ButtonBar :buttons="buttons" />
  </div>
</template>

<style scoped lang="scss">
.example {
  .text {
    margin-bottom: 20px;
  }
}
</style>
