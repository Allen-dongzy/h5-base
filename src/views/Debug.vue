<script setup lang="ts">
import useUserStore from '@/stores/useUserStore'
import { ref } from 'vue'
import useWecomStore, { Entry } from '@/stores/useWecomStore'

// debug登录
const { debugLoginApi } = useUserStore()
// 企微入口， 外部联系人id
const { setEntry, setExternalUserId } = useWecomStore()
// 路由
const route = useRouter()
const currentRoute = route.currentRoute.value

// 重定向地址
const { redirect } = currentRoute.query

// 企微入口
const entryValue = ref(Entry.normal)
const entryShow = ref(false)
const entryActions = Object.keys(Entry).map((item) => ({ name: item, color: '#003594' }))
const entrySelect = (item: { name: Entry }) => {
  entryValue.value = item.name
  entryShow.value = false
}

// 外部联系人id
const externalUserId = ref('dsfsdfdsfdsfdsfdsfdsf')

// 账号ID
const userId = ref('allen.dong')

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
  // 设置企微入口， 外部联系人id
  setEntry(entryValue.value)
  setExternalUserId(externalUserId.value)
  // 跳转
  skip()
}
</script>

<template>
  <div class="debug flex flex-col ai-center">
    <div class="title">DEBUG</div>
    <div class="row flex-row">
      <div class="label">企微入口:</div>
      <van-field
        class="input"
        v-model="entryValue"
        center
        :border="false"
        clearable
        placeholder="请选择企微入口"
        readonly
        @click="entryShow = true"
      />
    </div>
    <div class="row flex-row">
      <div class="label">外部联系人id:</div>
      <van-field
        class="input"
        v-model="externalUserId"
        center
        :border="false"
        clearable
        placeholder="请输入外部联系人id"
      />
    </div>
    <div class="row flex-row">
      <div class="label">用户邮箱:</div>
      <van-field
        class="input"
        v-model="userId"
        center
        :border="false"
        clearable
        placeholder="请输入email"
      />
    </div>
    <van-button type="primary" @click="login" class="button">登录</van-button>
    <!-- 企微入口 -->
    <van-action-sheet v-model:show="entryShow" :actions="entryActions" @select="entrySelect" />
  </div>
</template>

<style scoped lang="scss">
.debug {
  height: 100vh;
  padding: 120px 40px 0;
  box-sizing: border-box;
  color: #003594;
  .title {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 100px;
  }
  .row {
    width: calc(100vw - 80px);
    & + .row {
      margin-top: 20px;
    }
    .label {
      text-align: right;
      margin-right: 20px;
    }
    .input {
      flex: 1;
      width: 0;
      position: relative;
      width: 100%;
      --van-field-input-text-color: #003594;
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
  .button {
    width: calc(100vw - 80px);
    margin-top: 80px;
  }
}
</style>
