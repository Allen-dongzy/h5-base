<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import FunctionBar from '@/layout/components/FunctionBar.vue'
import KeepAliveRouterView from '@/layout/KeepAliveRouterView.vue'
import { routes } from '@/router'
import useRouterPermission from '@/composables/useRouterPermission'
import useMenu from '@/composables/useMenu'
import useBreadcrumb from '@/composables/useBreadcrumb'

// 副作用区域-start
const userinfo = ref({
  roleIds: ['admin']
})
// 副作用区域-end

const route = useRoute()
const router = useRouter()

// 有权限的路由列表,  当前路由是否有权限, 找到第一个有权限的路由
const { permissionRouters, isPermission, findFirstPermissionPath } = useRouterPermission(
  userinfo.value.roleIds
)

// 若当前路由无权限则重定向到第一个有权限的路由
if (!isPermission(route.meta.roles as string[])) {
  const path = findFirstPermissionPath(permissionRouters.value)
  if (path !== '/example') {
    router.replace(path)
  }
}

// 菜单, 当前打开的菜单项, 当前选择的菜单项, 菜单点击事件
const { menu, menuOpenKeys, menuSelectedKeys, menuClick } = useMenu(permissionRouters.value)

// 面包屑, 面包屑跳转
const { breadcrumb, breadcrumbSkip } = useBreadcrumb(permissionRouters.value)

// 侧边栏收缩
const siderCollapsed = ref(false)
const toggleSiderCollapsed = () => {
  siderCollapsed.value = !siderCollapsed.value
}

// 前往首页
const goHome = () => {
  const path = findFirstPermissionPath(permissionRouters.value)
  router.replace(path)
}
</script>

<template>
  <div class="layout">
    <a-layout class="layout">
      <a-layout-sider class="layout-sider" v-model:collapsed="siderCollapsed" :collapsedWidth="100">
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
          <FunctionBar />
        </a-layout-header>
        <a-layout-content class="layout-content">
          <a-breadcrumb class="layout-breadcrumb sel-hide">
            <a-breadcrumb-item
              class="layout-breadcrumb-item"
              v-for="(item, index) in breadcrumb"
              :key="item.key"
              @click="breadcrumbSkip(breadcrumb, index)"
            >
              {{ item.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout
            class="layout-content-main content-height"
            :class="{
              'layout-content-main content-height content-padding small-scrollbar':
                !route.meta.noLayoutContent
            }"
          >
            <KeepAliveRouterView v-if="isPermission(route.meta.roles as string[])" />
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout>
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
    // 菜单展开项hover状态的背景色
    :deep(.ant-menu-submenu-title:hover) {
      background-color: #fff;
    }
    // 菜单展开项里子菜单的背景色
    :deep(.ant-menu.ant-menu-sub.ant-menu-inline) {
      background-color: #fafafa;
    }
    // 菜单项被选择后的背景色
    :deep(.ant-menu-item-selected) {
      background-color: #f2f3f5 !important;
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
    background: #f2f3f5;
  }
  &-breadcrumb {
    padding: 20px 20px;
    &-item {
      cursor: pointer;
    }
  }
}
</style>
