import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'

export default (roleIds: string[]) => {

  // 角色列表
  const roles = ref<string[]>(roleIds || [])
  // 路由列表
  const routers = ref<any>(routes?.[0]?.children || [])
  // 有权限的路由列表
  const permissionRouters = ref<any>([])
  // 过滤出有权限的路由列表
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
  permissionRouters.value = filterNoPermissionRouteList(routers.value)

  // 当前路由是否有权限
  const isPermission = (currentRouteRoles: string[]) => {
    if (!currentRouteRoles || currentRouteRoles.length === 0) {
      return true
    }
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

  return { routers, permissionRouters, filterNoPermissionRouteList, isPermission, findFirstPermissionPath }
}