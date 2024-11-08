import type { VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'

// 菜单类型
export interface Menu {
  key: string
  icon?: () => VNode
  label: string
  title: string
  children?: Menu[]
}

export default (routeList: RouteRecordRaw[]) => {

  const route = useRoute()
  const router = useRouter()

  // 面包屑
  const breadcrumb = ref<Menu[]>([])
  // 面包屑跳转
  const breadcrumbSkip = (menu: Menu[], index: number) => {
    if (index === 0) {
      router.replace(findFirstPermissionMenu(menu))
    } else {
      router.replace(`/${menu.map((item) => item.key).join('/')}`)
    }
  }
  // 找到第一个有权限的菜单
  const findFirstPermissionMenu = (list: Menu[], pathArr: string[] = []): string => {
    const currentItem = list[0]
    pathArr.push(currentItem.key)
    if (currentItem?.children) {
      findFirstPermissionMenu(currentItem.children, pathArr)
    }
    return `/${pathArr.join('/')}`
  }

  // 获取打开的路由列表
  const getOpenRouteList = (routeList: RouteRecordRaw[], pathList: string[]): RouteRecordRaw[] => {
    const breadcrumb: RouteRecordRaw[] = []
    const current = routeList.find((item) => item.path === pathList[0])
    if (current) {
      breadcrumb.push(current)
    }
    if (current?.children) {
      breadcrumb.push(...getOpenRouteList(current.children, pathList.slice(1)))
    }
    return breadcrumb
  }
  // 路由列表转菜单列表
  const routeListTransformMenu = (routeList: RouteRecordRaw[]): Menu[] => {
    return routeList.map((item) => ({
      key: item.path as string,
      icon: item.meta?.icon ? () => h(item.meta?.icon || '') : undefined,
      label: item.meta?.title as string,
      title: item.meta?.title as string,
      children: item.children && item.children.length > 0 ? routeListTransformMenu(item.children) : undefined
    })) as Menu[]
  }

  // 监听路由变化,更新面包屑
  watch(
    () => [route.fullPath, routeList],
    () => {
      if (!route.fullPath || route.fullPath === '/') return
      // 获取已经展开的路由列表并转换为菜单列表,设置面包屑
      const pathList = route.fullPath.split('/').slice(1).map(item => {
        return item.includes('?') ? item.split('?')[0] : item
      })
      const openRouteList = getOpenRouteList(routeList, pathList)
      breadcrumb.value = routeListTransformMenu(openRouteList)
    },
    { immediate: true }
  )

  return {
    breadcrumb,
    breadcrumbSkip,
    findFirstPermissionMenu,
    getOpenRouteList,
    routeListTransformMenu
  }

}