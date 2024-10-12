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
  // 递归菜单
  const recursionMenu = (list: RouteRecordRaw[]): Menu[] | void => {
    // 过滤隐藏菜单
    const showList = list.filter((item) => item.meta?.hide !== true)
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
    breadcrumb.value = getBreadcrumb(menu.value, keyPath)
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
  // 获取面包屑
  const getBreadcrumb = (list: Menu[], keyPath: string[]): Menu[] => {
    const breadcrumb = []
    const current = list.find((item) => item.key === keyPath[0])
    if (current) {
      breadcrumb.push(current)
    }
    if (current?.children) {
      breadcrumb.push(...getBreadcrumb(current.children, keyPath.slice(1)))
    }
    return breadcrumb
  }
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


  // 监听菜单变化或路由变化,初始化菜单项和面包屑
  watch(
    () => [menu.value, route.fullPath],
    () => {
      if (!menu.value || menu.value.length === 0) return
      // 若有路由,则从路由设置菜单项,反之初始化菜单项
      if (route.fullPath && route.fullPath !== '/') {
        const path = route.fullPath.split('/').slice(1).map(item => {
          return item.includes('?') ? item.split('?')[0] : item
        })
        menuOpenKeys.value = path
        menuSelectedKeys.value = [path[path.length - 1]]
      } else {
        initSelectKeys(menu.value)
      }
      breadcrumb.value = getBreadcrumb(menu.value, menuOpenKeys.value)
    },
    { immediate: true }
  )

  return { menu, recursionMenu, generateMenu, menuOpenKeys, menuSelectedKeys, menuClick, initSelectKeys, breadcrumb, getBreadcrumb, breadcrumbSkip, findFirstPermissionMenu }
}