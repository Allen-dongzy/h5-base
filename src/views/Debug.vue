<script setup lang="ts" name="debug">
import useUserStore from '@/stores/useUserStore'
import { ref } from 'vue'

// debug登录
const { debugLoginApi } = useUserStore()

// 账号ID
const userId = ref('allen.dong')

// 跳转
const skip = () => {
  window.location.replace(import.meta.env.BASE_URL)
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
    <a-input class="input" v-model:value="userId" placeholder="请输入账号ID" />
    <a-button type="primary" @click="login">Login</a-button>
  </div>
</template>

<style scoped lang="scss">
.debug {
  height: 100vh;
  .input {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
