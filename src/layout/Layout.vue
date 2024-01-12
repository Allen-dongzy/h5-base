<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'
import type { Menu, MenuEvent } from '@/types/view/Layout'
import theme from '@/layout/theme'

const route = useRoute()
const router = useRouter()

// 菜单
const menu = computed(() => {
  const list = routes?.[0]?.children || []
  return recursionMenu(list)
})

// 递归菜单
const recursionMenu = (list: RouteRecordRaw[]): Menu[] => {
  return list.map((item) => ({
    key: item?.path as string,
    icon: item.meta?.icon ? () => h(item.meta?.icon || '') : undefined,
    label: item.meta?.title as string,
    title: item.meta?.title as string,
    children: item.children ? recursionMenu(item?.children || []) : undefined
  }))
}

// 当前打开的菜单项
const menuOpenKeys = ref<string[]>([])
// 当前选择的菜单项
const menuSelectedKeys = ref<string[]>([])
// 面包屑
const breadcrumb = ref<Menu[]>([])

// 菜单点击事件
const menuClick = ({ key, keyPath }: MenuEvent) => {
  menuSelectedKeys.value = [key || '']
  menuOpenKeys.value = keyPath || []
  breadcrumb.value = getBreadcrumb(menu.value, keyPath)
  router.replace(`/${keyPath.join('/')}`)
}
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
// 监听菜单变化或路由变化,初始化菜单项
watch(
  () => [menu.value, route.fullPath],
  () => {
    if (!menu.value || menu.value.length === 0) return
    // 若有路由,则从路由设置菜单项,反之初始化菜单项
    if (route.fullPath && route.fullPath !== '/') {
      const path = route.fullPath.split('/').slice(1)
      menuOpenKeys.value = path
      menuSelectedKeys.value = [path[path.length - 1]]
    } else {
      initSelectKeys(menu.value)
    }
    breadcrumb.value = getBreadcrumb(menu.value, menuOpenKeys.value)
  },
  { immediate: true }
)

// 侧边栏收缩
const siderCollapsed = ref(false)
const toggleSiderCollapsed = () => {
  siderCollapsed.value = !siderCollapsed.value
}
</script>

<template>
  <div class="layout">
    <a-config-provider :theme="theme">
      <a-layout class="layout">
        <a-layout-sider
          class="layout-sider"
          v-model:collapsed="siderCollapsed"
          :collapsedWidth="100"
        >
          <div class="layout-sider-logo flex-row-center sel-hide">
            <img src="@/assets/imgs/logo-black.png" alt="logo" />
          </div>
          <div class="sel-hide">
            <a-menu
              v-model:openKeys="menuOpenKeys"
              v-model:selectedKeys="menuSelectedKeys"
              mode="inline"
              :items="menu"
              @click="menuClick"
            ></a-menu>
          </div>
        </a-layout-sider>
        <a-layout>
          <a-layout-header class="layout-header flex-row sel-hide">
            <MenuUnfoldOutlined
              v-if="siderCollapsed"
              class="layout-header-collapsed"
              @click="toggleSiderCollapsed"
            />
            <MenuFoldOutlined
              v-else
              class="layout-header-collapsed"
              @click="toggleSiderCollapsed"
            />
            {{ routes?.[0]?.meta?.title || '管理后台' }}
          </a-layout-header>
          <a-layout-content class="layout-content">
            <a-breadcrumb class="layout-breadcrumb sel-hide">
              <a-breadcrumb-item v-for="item in breadcrumb" :key="item.key">
                {{ item.title }}
              </a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout class="layout-content-main">
              <router-view />
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<style scoped lang="scss">
.layout {
  height: 100vh;
  &-sider {
    width: 210px;
    height: 100%;
    background: #ffffff;
    &-logo {
      width: 100%;
      height: 62px;
      padding: 0 10px;
      img {
        width: 72px;
        height: 20px;
      }
    }
    // 菜单展开项背景色
    :deep(.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open) {
      background-color: #f5f4f2;
    }
    // 菜单展开项hover状态的背景色
    :deep(.ant-menu-submenu-title:hover) {
      background-color: #f5f4f2;
    }
    // 菜单展开项里子菜单的背景色
    :deep(.ant-menu.ant-menu-sub.ant-menu-inline) {
      background-color: #fafafa;
    }
    // 菜单项被选择后的背景色
    :deep(.ant-menu-item-selected) {
      background-color: transparent !important;
    }
    // 菜单项hover状态的背景色
    :deep(.ant-menu-item.ant-menu-item-active:hover) {
      background-color: transparent;
    }
    :deep(.ant-menu-item-selected:after) {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      background-color: #000;
    }
    // 消除间隙和圆角
    :deep(.ant-menu-item) {
      position: relative;
      border-radius: 0 !important;
      margin-inline: 0;
      margin-block: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding-inline: calc(50% - 8px);
    }
    :deep(.ant-menu-submenu) {
      border-radius: 0 !important;
      margin-inline: 0;
      margin-block: 0;
      width: 100%;
    }
    :deep(.ant-menu-submenu-title) {
      border-radius: 0 !important;
      margin-inline: 0;
      margin-block: 0;
      width: 100%;
      height: 60px;
      padding-inline: calc(50% - 8px);
    }
    // 菜单项文字样式
    :deep(.ant-menu-title-content) {
      line-height: 60px;
      flex: none !important;
      margin-left: 8px !important;
    }
  }
  &-header {
    height: 62px;
    line-height: 62px;
    background: #ffffff;
    padding-inline: 0;
    color: #45301d;
    font-size: 18px;
    font-family: CenturyGothic;
    line-height: 22px;
    &-collapsed {
      padding: 0 12px;
      margin-left: 8px;
      font-size: 20px;
      color: #45301d;
    }
  }
  &-content {
    height: calc(100% - 62px);
    background: #f7f7f7;
    &-main {
      height: calc(100% - 62px - 30px);
      overflow-y: auto;
      background: #ffffff;
      margin: 0 30px;
      padding: 30px;
      box-sizing: border-box;
    }
  }
  &-breadcrumb {
    padding: 20px 30px;
  }
}
</style>
