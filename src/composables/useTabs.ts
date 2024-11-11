import { ref, watch, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/tools'

// TabPane类型
export type TabPane = {
  tab: string
  content: any
  key?: string
  show?: boolean
}

// Tab实参类型
export interface TabParam {
  panes: Record<string, TabPane>
}

export default ({ panes }: TabParam) => {
  const router = useRouter()

  const tabKey = ref<string | undefined>('')
  const tabList = ref<TabPane[]>([])

  // 监听tab变化
  watch(
    () => tabKey.value,
    () => {
      if (!tabKey.value) return
      router.replace({
        query: {
          ...router.currentRoute.value.query,
          tabKey: tabKey.value
        }
      })
    },
    {
      immediate: true
    }
  )

  // 监听路由变化
  watch(
    () => router.currentRoute.value.query,
    (query) => {
      if (query.tabKey) {
        tabKey.value = query.tabKey as string
      } else {
        if (!tabList.value[0]?.key) return
        tabKey.value = tabList.value[0]?.key
        router.replace({
          query: {
            ...router.currentRoute.value.query,
            tabKey: tabKey.value
          }
        })
      }
    },
    { immediate: true, deep: true }
  )

  // 创建tab列表
  const createTabList = () => {
    tabList.value = Object.keys(panes).map((key) => {
      return {
        key,
        tab: panes[key].tab,
        content: panes[key].content
      }
    })
    tabKey.value = tabKey.value || tabList.value[0]?.key
  }

  // 恢复tab
  const recoverTab = debounce(() => {
    const query = router.currentRoute.value.query
    if (query.tab) {
      tabKey.value = query.tabKey as string
    }
  }, 100)

  onMounted(() => {
    createTabList()
    recoverTab()
  })

  onActivated(() => {
    recoverTab()
  })

  return {
    tabKey,
    tabList,
    createTabList,
    recoverTab,
  }
} 