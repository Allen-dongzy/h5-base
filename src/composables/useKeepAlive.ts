import { ref, onActivated } from 'vue'
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

  // 设置需要缓存的路由信息
  const setRouteInfo = (toRouterName: routeParam['toRouterName']) => {
    selfName.value = router.currentRoute.value.name as string
    toName.value = toRouterName
    router.currentRoute.value.meta.keepAlive = true
  }

  onActivated(() => {
    // 缓存组件被激活并且路由信息一致,则取消缓存
    if (router.currentRoute.value.name === selfName.value) {
      router.currentRoute.value.meta.keepAlive = false
      removeKeepAliveItem(selfName.value)
    }
  })

  return {
    selfName,
    toName,
    setRouteInfo
  }
}