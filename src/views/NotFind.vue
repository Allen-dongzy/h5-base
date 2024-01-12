<script setup lang="ts" name="notFind">
import theme from '@/layout/theme'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/')
}
</script>

<template>
  <div class="not-find flex-row-center">
    <a-config-provider :theme="theme">
      <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在。">
        <template #extra>
          <a-button type="primary" @click="goHome">返回首页</a-button>
        </template>
      </a-result>
    </a-config-provider>
  </div>
</template>

<style scoped lang="scss">
.not-find {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
}
</style>
