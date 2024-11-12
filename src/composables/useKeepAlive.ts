import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAppStore from '@/stores/useAppStore'

// app商店
const appStore = useAppStore()
// 删除缓存组件项
const { removeKeepAliveItem } = appStore

// 参数
interface routeParam {
  selfRouterName: string
  toRouterName: string
}

export default () => {
  const router = useRouter()

  // 当前路由名称
  const selfName = ref('')
  // 前往的路由名称
  const toName = ref('')

  // 缓存当前路由
  const cacheCurrentRoute = (toRouterName: routeParam['toRouterName']) => {
    selfName.value = router.currentRoute.value.name as string
    toName.value = toRouterName
    router.currentRoute.value.meta.keepAlive = true
  }

  // 路由守卫
  router.beforeEach((to, from, next) => {
    // 如果跳转到当前路由 并且 前来的路由不是最初前往的路由,则取消缓存
    if (to.name === selfName.value && from.name !== toName.value) {
      removeKeepAliveItem(to.name)
    }
    next()
  })

  return {
    selfName,
    toName,
    cacheCurrentRoute
  }
}