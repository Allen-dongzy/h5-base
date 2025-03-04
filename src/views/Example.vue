<script setup lang="ts">
import FilterBar from '@/components/common/FilterBar.vue'
import ButtonBar from '@/components/common/ButtonBar.vue'
import FilterArea from '@/components/common/FilterArea.vue'
import type { Buttons } from '@/types/components/ButtonBar'
import type { Filters } from '@/types/components/FilterBar'
import { PieChartOutlined } from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'
import useModal from '@/composables/useModal'
import Picture from '@/components/common/Picture.vue'

const { confirmModal } = useModal()

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
  },
  date: {
    component: 'input-number',
    label: '查询天数',
    addonAfter: '天'
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
      confirmModal({
        content: '确定删除吗？',
        confirm: async () => {
          buttons.delete.loading = true
          return await new Promise((resolve, reject) => {
            setTimeout(() => {
              buttons.delete.loading = false
              resolve()
            }, 500)
          })
        }
      })
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

// 图片区状态
const defaultPicture = {
  id: '',
  url: '',
  width: 150,
  height: 150,
  previewVisible: false
}
type IPicture = typeof defaultPicture & { setVisible: (value: boolean) => void }
const pictureState = reactive({
  list: [] as IPicture[]
})
const deletePicture = (picture: IPicture) => {
  confirmModal({
    content: '确定删除吗？',
    confirm: async () => {
      console.log('delete', picture)
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
    }
  })
}
// 图片区状态赋值
const picList = [
  {
    id: '1',
    url: 'https://img.yzcdn.cn/vant/cat.jpeg'
  },
  {
    id: '2',
    url: 'https://img1.baidu.com/it/u=2062152131,1998701002&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1421'
  },
  {
    id: '3',
    url: 'https://pic.rmb.bdstatic.com/bjh/news/57e572cd41520408ebbbe5e3a6fb5b6d.jpeg'
  }
]
picList.forEach((item, index) => {
  pictureState.list.push({
    ...defaultPicture,
    ...item,
    setVisible: (value: boolean) => {
      pictureState.list[index].previewVisible = value
    }
  })
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
    <div class="page-content flex ai-center flex-wrap">
      <Picture
        class="picture"
        :state="item"
        v-for="(item, index) in pictureState.list"
        :key="index"
        @delete="deletePicture"
      />
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

  .page-content {
    margin: 20px 0;
    padding-top: 20px;
    gap: 20px;
    .picture {
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>
