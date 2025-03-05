<script setup lang="ts">
import useAppStore from '@/stores/useAppStore'
import { useI18n } from 'vue-i18n'
import theme from '@/vant/theme'
import localeZh from 'vant/es/locale/lang/zh-CN'
import localeEn from 'vant/es/locale/lang/en-US'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import dayjs from 'dayjs'
import KeepAliveRouterView from '@/layout/KeepAliveRouterView.vue'
import { debounce } from './utils/tools'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useRouter } from 'vue-router'

// 设置路由进度条
const router = useRouter()
router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

// app商店
const appStore = useAppStore()
// 设置窗口宽度
const { setWindowWidth } = appStore
// 语言, 窗口宽度
const { lang, windowWidth } = storeToRefs(appStore)

// i18n
const { locale } = useI18n()
// 设置i18n语言
locale.value = lang.value

// UI语言
const UILocale = ref(localeZh)
// 初始化antd语言
watch(
  () => lang.value,
  () => {
    UILocale.value = lang.value === 'zh' ? localeZh : localeEn
    dayjs.locale(lang.value)
  },
  { immediate: true }
)

// 监听屏幕resize
const handleResize = debounce(function () {
  console.log('屏幕宽度：', window.innerWidth)
  setWindowWidth(window.innerWidth)
  console.log('记录屏幕宽度', windowWidth.value)
}, 300)
window.addEventListener('resize', () => handleResize())
handleResize()
</script>

<template>
  <van-config-provider theme-vars-scope="global" :theme-vars="theme">
    <KeepAliveRouterView />
  </van-config-provider>
</template>

<style scoped lang="scss"></style>
