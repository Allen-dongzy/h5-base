<script setup lang="ts">
import UserBar from './UserBar.vue'

// emit
const emit = defineEmits(['logout'])

// 退出登录
const logout = () => {
  emit('logout')
}
</script>

<template>
  <div class="function-bar flex-1 flex-row-end">
    <UserBar @logout="logout" />
  </div>
</template>

<style scoped lang="scss">
.function-bar {
  height: 100%;
  padding: 0 20px;
  font-size: 18px;
}
</style>
