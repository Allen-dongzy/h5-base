<script setup lang="ts" name="login">
import { queryToObj } from '@/utils/tools'
import { routes } from '@/router'

// 路由参数
const params = queryToObj(window.location.search)
// 重定向地址
const redirectPath = params.redirect ? decodeURIComponent(params.redirect) : '/'

// 跳转
const skip = () => {
  window.location.replace(redirectPath)
}

// // 请求企业二维码登录配置
// const requestQrInit = async () => {
//   const [err, res] = await qrInit()
//   if (err) return
//   return res.data
// }

// // 请求登录网页授权登陆链接
// const requestWechatAuthEntry = async (config: any) => {
//   const data = {
//     redirect: `${config.baseUrl}admin/index.html`,
//     state: Math.round(new Date().valueOf() * Math.random()).toString()
//   }
//   const [err, res] = await wechatAuthEntry(data)
//   if (err) return
//   const info = queryToObj(res.data.split('?')[1])
//   new (window as any).WwLogin({
//     id: 'qr_login',
//     appid: info.appid,
//     agentid: config.agentId,
//     redirect_uri: redirectPath as string,
//     state: info.state,
//     href: '',
//     lang: 'zh'
//   })
// }

// // js-sdk初始化
// onMounted(async () => {
//   const config = await requestQrInit()
//   requestWechatAuthEntry(config)
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
