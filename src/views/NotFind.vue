<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NotFind'
})

const router = useRouter()

const goHome = () => {
  router.replace('/')
}
</script>

<template>
  <div class="not-find flex-col-center">
    <van-icon name="warning-o" class="icon" />
    <div class="tips">404,页面找不到了</div>
    <van-button type="primary" @click="goHome" class="button">返回首页</van-button>
  </div>
</template>

<style scoped lang="scss">
.not-find {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  .icon {
    font-size: 260px;
    color: #003594;
  }
  .tips {
    font-size: 28px;
    font-weight: 700;
    color: #003594;
    margin-top: 40px;
  }
  .button {
    margin-top: 80px;
  }
}
</style>
