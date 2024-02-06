<script setup lang="ts" name="example">
import FilterBar from '@/components/common/FilterBar.vue'
import ButtonBar from '@/components/common/ButtonBar.vue'
import FilterArea from '@/components/common/FilterArea.vue'
import type { Buttons } from '@/types/components/ButtonBar'
import type { Filters } from '@/types/components/FilterBar'
import { PieChartOutlined } from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'

const route = useRoute()

// 路径
const path = computed(() => route.fullPath)

// 查询参数
const query = reactive({
  time: [] as Dayjs[],
  price: '' as string,
  type: undefined as string | undefined
})

// 筛选
const filters = reactive<Filters>({
  time: {
    component: 'range-picker',
    placeholder: ['开始时间', '结束时间'],
    change: (value: string) => {
      console.log('time', value)
    }
  },
  price: {
    component: 'input',
    placeholder: '请输入价格',
    prefix: h(PieChartOutlined),
    suffix: '元',
    change: (value: string) => {
      console.log('price', value)
    }
  },
  type: {
    label: '类型',
    component: 'select',
    width: 300,
    placeholder: '请选择类型',
    options: [],
    change: (value: string) => {
      console.log('type', value)
    }
  },
  store: {
    label: '门店',
    component: 'select',
    width: 300,
    placeholder: '请选择门店',
    mode: 'multiple',
    options: [],
    change: (value: string) => {
      console.log('store', value)
    }
  }
})

// 按钮
const buttons = reactive<Buttons>({
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
  export: {
    text: '导出',
    type: 'primary',
    click: () => {
      console.log('导出')
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

// 模拟接口请求
onMounted(() => {
  setTimeout(() => {
    // 获取类型列表
    filters.type.options = [
      {
        label: '类型1',
        value: '1'
      },
      {
        label: '类型2',
        value: '2'
      }
    ]
    // 获取门店列表
    filters.store.options = [
      {
        label: '门店1',
        value: '1'
      },
      {
        label: '门店2',
        value: '2'
      },
      {
        label: '门店3',
        value: '3'
      }
    ]
  }, 500)
})
</script>

<template>
  <div class="example flex-col-start">
    <div class="text">example: {{ path }}</div>

    <div>
      <div class="text">合并筛选:</div>
      <FilterArea v-model:query="query" :filters="filters" :buttons="buttons" />
    </div>

    <div>
      <div class="text">分开筛选:</div>
      <div class="filter-area flex-col-start">
        <FilterBar v-model:query="query" :filters="filters" />
        <ButtonBar :buttons="buttons" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.example {
  gap: 40px;
  .text {
    margin: 20px 0;
  }
  .filter-area {
    gap: 10px;
  }
}
</style>
