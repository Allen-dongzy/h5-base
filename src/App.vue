<script setup lang="ts">
import useAppStore from '@/stores/useAppStore'
import { useI18n } from 'vue-i18n'
import theme from '@/theme'
import localeZh from 'ant-design-vue/es/locale/zh_CN'
import localeEn from 'ant-design-vue/es/locale/en_US'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import dayjs from 'dayjs'
import KeepAliveRouterView from '@/layout/KeepAliveRouterView.vue'
import { debounce } from './utils/tools'

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

// antd语言
const antdLocale = ref(localeZh)
// 初始化antd语言
watch(
  () => lang.value,
  () => {
    antdLocale.value = lang.value === 'zh' ? localeZh : localeEn
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
  <a-config-provider :theme="theme" :locale="antdLocale">
    <KeepAliveRouterView />
  </a-config-provider>
</template>

<style scoped lang="scss"></style>
