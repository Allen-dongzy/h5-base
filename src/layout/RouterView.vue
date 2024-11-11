<script setup lang="ts">
import useAppStore from '@/stores/useAppStore'
import { useRouter } from 'vue-router'

const router = useRouter()
// app商店
const appStore = useAppStore()
// 设置缓存组件列表
const { setKeepAliveList } = appStore
// 缓存组件列表
const { keepAliveList } = storeToRefs(appStore)

// 路由守卫
router.beforeEach((to, from, next) => {
  if (from?.meta?.keepAlive) {
    setKeepAliveList(from.name as string)
  }
  if (to?.meta?.keepAlive) {
    setKeepAliveList(to.name as string)
  }
  next()
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped lang="scss">
.router-view {
}
</style>
