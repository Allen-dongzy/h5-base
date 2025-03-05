<script setup lang="ts">
import useUserStore from '@/stores/useUserStore'
import { ref } from 'vue'

// debug登录
const { debugLoginApi } = useUserStore()

// 账号ID
const userId = ref('allen.dong')

// 路由
const route = useRouter()
const currentRoute = route.currentRoute.value
const code = currentRoute.query?.code || ''

// 重定向地址
const { redirect } = currentRoute.query

// 跳转
const skip = () => {
  let baseUrl = import.meta.env.BASE_URL
  if (!baseUrl.endsWith('/')) baseUrl += '/'
  window.location.replace((redirect as string) || baseUrl)
}

// 登录
const login = async () => {
  if (!userId.value) return
  const isSuccess = await debugLoginApi(userId.value)
  if (!isSuccess) return
  skip()
}
</script>

<template>
  <div class="debug flex jc-center ai-center">
    <van-field class="input" v-model="userId" center :border="false" clearable placeholder="请输入账号ID" />
    <van-button type="primary" @click="login" class="button">Login</van-button>
  </div>
</template>

<style scoped lang="scss">
.debug {
  height: 100vh;
  padding: 80px;
  box-sizing: border-box;
  .input {
    position: relative;
    margin-right: 10px;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      border: 1px solid #003594;
      box-sizing: border-box;
      border-radius: 8px;
      pointer-events: none;
    }
  }
}
</style>
