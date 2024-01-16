<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import FunctionBar from '@/layout/components/FunctionBar.vue'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'
import type { Menu, MenuEvent } from '@/types/view/Layout'
import theme from '@/layout/theme'
import useAppStore from '@/stores/useAppStore'
import localeZh from 'ant-design-vue/es/locale/zh_CN'
import localeEn from 'ant-design-vue/es/locale/en_US'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

// app商店
const appStore = useAppStore()

// 语言
const { lang } = storeToRefs(appStore)
// antd语言
const antdLocale = ref(localeZh)
// 切换antd语言
watch(
  () => lang.value,
  () => {
    antdLocale.value = lang.value === 'zh' ? localeZh : localeEn
    dayjs.locale(lang.value)
  },
  { immediate: true }
)

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

// 前往首页
const goHome = () => {
  router.replace('/')
}

// 前往指定路径
const goPath = (info: Menu) => {
  const currentIndex = menuOpenKeys.value.findIndex((item) => item === info.key)
  const pathArr = menuOpenKeys.value.slice(0, currentIndex + 1)
  router.replace(`/${pathArr.join('/')}`)
}

// 退出登录
const logout = () => {
  router.replace('/login')
}
</script>

<template>
  <div class="layout">
    <a-config-provider :theme="theme" :locale="antdLocale">
      <a-layout class="layout">
        <a-layout-sider
          class="layout-sider"
          v-model:collapsed="siderCollapsed"
          :collapsedWidth="100"
        >
          <div class="layout-sider-logo flex-row-center sel-hide">
            <img src="@/assets/imgs/logo-black.png" alt="logo" @click="goHome" />
          </div>
          <div class="sel-hide">
            <a-menu
              :openKeys="menuOpenKeys"
              :selectedKeys="menuSelectedKeys"
              mode="inline"
              :items="menu"
              @click="menuClick"
            ></a-menu>
          </div>
        </a-layout-sider>
        <a-layout>
          <a-layout-header class="layout-header flex-row sel-hide">
            <div class="layout-header-title flex-row">
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
              <span @click="goHome">{{ routes?.[0]?.meta?.title || '管理后台' }}</span>
            </div>
            <FunctionBar @logout="logout" />
          </a-layout-header>
          <a-layout-content class="layout-content">
            <a-breadcrumb class="layout-breadcrumb sel-hide">
              <a-breadcrumb-item
                class="layout-breadcrumb-item"
                v-for="item in breadcrumb"
                :key="item.key"
                @click="goPath(item)"
              >
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
        cursor: pointer;
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
    &-title {
      height: 100%;
      & > span {
        cursor: pointer;
      }
    }
  }
  &-content {
    height: calc(100% - 62px);
    background: #f7f7f7;
    &-main {
      height: calc(100% - 62px - 30px);
      overflow-x: hidden;
      overflow-y: auto;
      background: #ffffff;
      margin: 0 30px;
      padding: 30px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 4px;
        background: #f7f7f7;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #e1e1e1;
        border-radius: 10px;
        box-shadow: 0 0 3px #999;
      }
    }
  }
  &-breadcrumb {
    padding: 20px 30px;
    &-item {
      cursor: pointer;
    }
  }
}
</style>
