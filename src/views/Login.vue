<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routes } from '@/router'
// import useUserStore from '@/stores/useUserStore'
// const { qrLoginApi } = useUserStore()

// 路由
const router = useRouter()
const currentRoute = router.currentRoute.value
// const code = currentRoute.query?.code || ''

// 重定向地址
const { redirect } = currentRoute.query

// 跳转
const skip = () => {
  let baseUrl = import.meta.env.BASE_URL
  if (!baseUrl.endsWith('/')) baseUrl += '/'
  window.location.replace((redirect as string) || baseUrl)
}

// // 获取agent企业微信配置
// const entryFirstApi = async () => {
//   const {err, res} = await entryFirst()
//   if (err) return
//   return res.data
// }
// // 请求登录网页授权登陆链接
// const requestWechatAuthEntry = async (config: any) => {
//   new (window as any).WwLogin({
//     id: 'qr_login',
//     appid: config.corpId,
//     agentid: config.agentId,
//     redirect_uri: `${config.baseUrl}${import.meta.env.VITE_APP_SERVER_URL_PREFIX}/login`,
//     state: Math.round(new Date().valueOf() * Math.random()).toString(),
//     href: '',
//     lang: 'zh'
//   })
// }

// // 扫码登录管理
// const scanManager = async () => {
//   const config = await entryFirstApi()
//   requestWechatAuthEntry(config)
//   if (code) {
//     const res = await qrLoginApi(code as string)
//     if (!res) return
//     skip()
//   }
// }

// onMounted(async () => {
//   scanManager()
// })
</script>

<template>
  <div class="login flex-col-center">
    <div class="title">{{ routes?.[0]?.meta?.title || '管理后台' }}</div>
    <div class="qr flex-row-center" id="qr_login">
      <a-button @click="skip">登录</a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  height: 100vh;
  .title {
    font-size: 30px;
    font-weight: bold;
  }
  .qr {
    width: 430px;
    height: 430px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(227, 223, 223, 0.5);
    border-radius: 10px;
    margin-top: 30px;
  }
}
</style>
