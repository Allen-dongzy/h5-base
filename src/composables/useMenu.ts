import { ref, watch, type VNode } from 'vue'
import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router'
import type { ItemType } from 'ant-design-vue'

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

  // 监听菜单变化或路由变化,更新菜单项
  watch(
    () => [menu.value, route.fullPath],
    () => {
      if (!menu.value || menu.value.length === 0) return
      // 如果没有路由就初始化菜单项
      if (!route.fullPath || route.fullPath === '/') return initSelectKeys(menu.value)
      // 设置菜单项
      const pathList = route.fullPath.split('/').slice(1).map(item => {
        return item.includes('?') ? item.split('?')[0] : item
      })
      menuOpenKeys.value = pathList
      menuSelectedKeys.value = [pathList[pathList.length - 1]]
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
    initSelectKeys
  }
}