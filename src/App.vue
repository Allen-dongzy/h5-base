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
import { debounce, queryToObj } from '@/utils/tools'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useRouter } from 'vue-router'
import useWecomStore from '@/stores/useWecomStore'
import { register, getContext } from '@/utils/wecomUtils'
import useUserStore from '@/stores/useUserStore'

const userStore = useUserStore()
const { token } = storeToRefs(userStore)

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

// 设置企微入口
const { setEntry } = useWecomStore()
// 初始化
const init = async () => {
  // 获取用户信息等
  // js-sdk
  // const res = await register()
  // if (res) {
  //   const res = await getContext()
  //   if (!res) return
  //   setEntry(res!.entry)
  // }
}

// 授权
onMounted(async () => {
  const pathNameArr = window.location.pathname.split('/')
  // 白名单
  if (['debug', 'login'].includes(pathNameArr[pathNameArr.length - 1])) return
  // 已登录
  if (token.value) return init()
  // 本地开发走debug模式
  if (import.meta.env.DEV) return router.replace('/debug')
  // 跳转授权或code登录
  const searshObj = queryToObj(window.location.search)
  if (!searshObj?.code) {
    // 获取OAuth2授权链接并跳转
    console.log('获取OAuth2授权链接并跳转')
  } else {
    // OAuth2授权链接携带code重定向回来执行登录
    console.log('OAuth2授权链接携带code重定向回来执行登录')
    // 登录成功后执行初始化操作（jssdk，公共用户信息等）
    // if (xxxxx) init()
  }
})
</script>

<template>
  <van-config-provider theme-vars-scope="global" :theme-vars="theme">
    <KeepAliveRouterView />
  </van-config-provider>
</template>

<style scoped lang="scss"></style>
