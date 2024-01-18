<script setup lang="ts" name="login">
import { queryToObj } from '@/utils/tools'

// 路由参数
const params = queryToObj(window.location.search)
// 重定向地址
const redirectPath = params.redirect || '/'

// 登录
const login = () => {
  window.location.replace(redirectPath)
}
</script>

<template>
  <div class="login flex-col-center">
    login
    <a-button @click="login">登录</a-button>
  </div>
</template>

<style scoped lang="scss">
.login {
}
</style>
