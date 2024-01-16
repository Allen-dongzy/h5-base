<script setup lang="ts">
import iconAvatar from '@/assets/imgs/icon-avatar.png'
import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { createVNode } from 'vue'

// emit
const emit = defineEmits(['logout'])

// 退出登录
const logout = () => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'font-size:14px;' }, '是否要退出登录?'),
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      emit('logout')
    }
  })
}
</script>

<template>
  <div class="user-bar flex-row">
    <div class="avatar-box flex-row-center">
      <img class="avatar" :src="iconAvatar" />
    </div>
    <div class="user-name">{{ '用户名' }}</div>
    <LogoutOutlined class="icon-exit" @click="logout" />
  </div>
</template>

<style scoped lang="scss">
.user-bar {
  padding: 0 10px;
  .avatar-box {
    width: 40px;
    height: 40px;
    background-color: #ddd;
    border-radius: 50%;
    padding: 5px;
    margin-left: 10px;
    .avatar {
      width: 100%;
      height: 100%;
    }
  }
  .user-name {
    margin-left: 12px;
    font-size: 14px;
  }
  .icon-exit {
    margin-left: 26px;
    cursor: pointer;
  }
}
</style>
