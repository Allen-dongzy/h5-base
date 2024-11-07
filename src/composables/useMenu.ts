import type { VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { ItemType } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'

// 菜单类型
export interface Menu {
  key: string
  icon?: () => VNode
  label: string
  title: string
  children?: Menu[]
}

// 菜单点击事件类型
export interface MenuEvent {
  item: ItemType
  key: string
  keyPath: string[]
}

export default (routeList: RouteRecordRaw[]) => {

  const route = useRoute()
  const router = useRouter()

  // 菜单
  const menu = ref<Menu[]>([])
  // 全部菜单
  const allMenu = ref<Menu[]>([])
  // 递归菜单
  const recursionMenu = (list: RouteRecordRaw[], mode: 'all' | 'visible' = 'visible'): Menu[] | void => {
    // 过滤隐藏菜单
    const showList = mode === 'visible' ? list.filter((item) => item.meta?.hide !== true) : list
    if (showList.length === 0) return undefined
    // 生成菜单树
    return showList.map((item) => ({
      key: item?.path as string,
      icon: item.meta?.icon ? () => h(item.meta?.icon || '') : undefined,
      label: item.meta?.title as string,
      title: item.meta?.title as string,
      children: item.children && item.children.length > 0 ? recursionMenu(item?.children || []) : undefined
    })) as Menu[]
  }
  // 生成菜单
  const generateMenu = (list: RouteRecordRaw[]) => {
    menu.value = recursionMenu(list) as Menu[]
    allMenu.value = recursionMenu(list, 'all') as Menu[]
    return menu.value
  }
  generateMenu(routeList)


  // 当前打开的菜单项
  const menuOpenKeys = ref<string[]>([])
  // 当前选择的菜单项
  const menuSelectedKeys = ref<string[]>([])
  // 菜单点击事件
  const menuClick = ({ key, keyPath }: MenuEvent) => {
    menuSelectedKeys.value = [key || '']
    menuOpenKeys.value = keyPath || []
    router.replace(`/${keyPath.join('/')}`)
  }
  // 初始化选择项
  const initSelectKeys = (list: Menu[]) => {
    menuOpenKeys.value.push(list[0]?.key || '')
    if (list[0]?.children) {
      initSelectKeys(list[0].children)
    } else {
      menuSelectedKeys.value = [list[0]?.key || '']
    }
    return
  }


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

  
  // 监听菜单变化或路由变化,初始化菜单项和面包屑
  watch(
    () => [menu.value, route.fullPath, routeList],
    () => {
      if (!menu.value || menu.value.length === 0) return
      if (route.fullPath && route.fullPath !== '/') {
        // 设置菜单项
        const pathList = route.fullPath.split('/').slice(1).map(item => {
          return item.includes('?') ? item.split('?')[0] : item
        })
        menuOpenKeys.value = pathList
        menuSelectedKeys.value = [pathList[pathList.length - 1]]
        // 获取已经展开的路由列表并转换为菜单列表,设置面包屑
        const openRouteList = getOpenRouteList(routeList, pathList)
        breadcrumb.value = routeListTransformMenu(openRouteList)
      } else {
        // 初始化菜单项
        initSelectKeys(menu.value)
      }
    },
    { immediate: true }
  )

  return {
    menu,
    allMenu,
    recursionMenu,
    generateMenu,
    menuOpenKeys,
    menuSelectedKeys,
    menuClick,
    initSelectKeys,
    breadcrumb,
    breadcrumbSkip,
    findFirstPermissionMenu,
    getOpenRouteList,
    routeListTransformMenu
  }
}