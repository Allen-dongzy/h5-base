import { ref } from 'vue'
import type { VNode } from 'vue'
import type { Menu } from 'ant-design-vue'
import type { RouteRecordRaw } from 'vue-router'

// 菜单类型
export interface Menu {
  key: string
  icon?: () => VNode
  label: string
  title: string
  children?: Menu[]
}

export default (roleIds: string[]) => {

  // 权限列表
  const roles = ref<string[]>(roleIds || [])

  // 过滤没有权限的路由列表
  const filterNoPermissionRouteList = (list: RouteRecordRaw[]): RouteRecordRaw[] => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      // 若有meta.roles角色数组则判断是否有权限,反之说明该项无需任何权限,直接返回
      if (Array.isArray(item.meta?.roles) && (item?.meta?.roles as string[])?.length > 0) {
        // 判断是否有权限
        const hasRole = item.meta?.roles.some((role) =>
          roles.value.includes(role as string)
        )
        // 若无权限则删除该项,反之判断是否有子菜单,若有则继续过滤子项菜单
        if (!hasRole) {
          list.splice(i, 1)
          i--
        } else if (item.children && item.children.length > 0) {
          item.children = filterNoPermissionRouteList(item.children)
          // 若子菜单过滤后为空,则删除该项
          if (item.children.length === 0) {
            list.splice(i, 1)
            i--
          }
        }
      }
    }
    return list
  }

  // 生成菜单
  const generateMenu = (list: RouteRecordRaw[]): Menu[] => {
    return list.map((item) => ({
      key: item?.path as string,
      icon: item.meta?.icon ? () => h(item.meta?.icon || '') : undefined,
      label: item.meta?.title as string,
      title: item.meta?.title as string,
      children: item.children ? generateMenu(item?.children || []) : undefined
    }))
  }

  // 当前路由是否有权限
  const isPermission = (currentRouteRoles: string[]) => {
    return currentRouteRoles.some((item) => roles.value.includes(item))
  }

  // 找到第一个有权限的路径
  const findFirstPermissionPath = (list: RouteRecordRaw[], pathArr: string[] = []): string => {
    const currentItem = list[0]
    pathArr.push(currentItem.path)
    if (currentItem?.children) {
      findFirstPermissionPath(currentItem.children, pathArr)
    }
    return `/${pathArr.join('/')}`
  }

  return { filterNoPermissionRouteList, generateMenu, isPermission, findFirstPermissionPath }
}