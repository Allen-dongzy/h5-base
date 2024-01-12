<script setup lang="ts">
import useAppStore from '@/stores/useAppStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// 路由实例
const router = useRouter()
// app商店
const appStore = useAppStore()
// 设置路由栈
const { setRouteStack, clearRouteStack } = appStore
// 路由栈
const { routeStack, lang } = storeToRefs(appStore)
// 初始化路由栈
clearRouteStack()

// 路由守卫
router.beforeEach((to, from, next) => {
  // 待写入路由栈
  const stack = to.matched && to.matched.length > 1 ? to.matched : [to]
  // 写入路由
  stack.forEach((item) => {
    if (item.name === 'tabbar') {
      clearRouteStack()
    }
    setRouteStack(item.name as string)
  })
  next()
})

// i18n
const { locale } = useI18n()
// 设置i18n语言
locale.value = lang.value
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
        <!-- 动态更新keep-alive -->
        <keep-alive :include="routeStack">
          <component :is="Component" />
        </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped lang="scss"></style>
