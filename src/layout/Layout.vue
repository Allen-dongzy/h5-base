<script setup lang="ts">
import {
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

const items = reactive([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'Option 1',
    title: 'Option 1'
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'Option 2',
    title: 'Option 2'
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Sub Menu',
    title: 'Sub Menu',
    children: [
      {
        key: '3',
        label: 'Option 3',
        title: 'Option 3'
      },
      {
        key: '4',
        label: 'Option 4',
        title: 'Option 4'
      }
    ]
  }
])

// 当前打开的菜单项
const menuOpenKeys = ref([''])
// 当前选择的菜单项
const menuSelectedKeys = ref(['1'])

// 侧边栏收缩
const siderCollapsed = ref(false)
const toggleSiderCollapsed = () => {
  siderCollapsed.value = !siderCollapsed.value
}
</script>

<template>
  <div class="layout">
    <a-layout class="layout">
      <a-layout-sider class="layout-sider" v-model:collapsed="siderCollapsed" :collapsedWidth="100">
        <div class="layout-sider-logo flex-row-center">
          <img src="@/assets/imgs/logo-black.png" alt="logo" />
        </div>
        <div class="layout-sider-menu">
          <a-menu
            v-model:openKeys="menuOpenKeys"
            v-model:selectedKeys="menuSelectedKeys"
            mode="inline"
            :inlineIndent="50"
            :items="items"
          ></a-menu>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="layout-header flex-row">
          <MenuUnfoldOutlined
            v-if="siderCollapsed"
            class="layout-header-collapsed"
            @click="toggleSiderCollapsed"
          />
          <MenuFoldOutlined v-else class="layout-header-collapsed" @click="toggleSiderCollapsed" />
          DIOR 管理后台
        </a-layout-header>
        <a-layout-content class="layout-content">
          <a-breadcrumb class="layout-breadcrumb">
            <a-breadcrumb-item>User</a-breadcrumb-item>
            <a-breadcrumb-item>Bill</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout class="layout-content-main"> main </a-layout>
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
    :deep(.ant-menu-title-content) {
      line-height: 60px;
      flex: none !important;
      margin-left: 5px !important;
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
