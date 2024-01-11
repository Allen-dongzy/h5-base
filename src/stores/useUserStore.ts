import storage from '@/utils/storage'
import { getuserinfo } from '@/apis/users'
import type { Userinfo } from '@/types/interface/users'


const useUserStore = defineStore('useUserStore', () => {
  // token
  const token = ref<string>(storage.get('token') || '')
  // 设置token
  const setToken = (currentToken?: string) => {
    storage.set('token', currentToken || '')
    token.value = currentToken || ''
  }

  // 用户信息
  const userinfo = ref<Partial<Userinfo>>(storage.get('userinfo') || {})
  // 设置用户信息
  const setUserinfo = (currentUserinfo?: Partial<Userinfo>) => {
    storage.set(
      'userinfo',
      currentUserinfo && Object.keys(currentUserinfo).length > 0 ? currentUserinfo : ''
    )
    userinfo.value = currentUserinfo || {}
  }
  // 获取用户信息
  const getuserinfoApi = async () => {
    const [err, res] = await getuserinfo()
    if (err) return
    setUserinfo(res.info)
  }

  return {
    token,
    setToken,
    userinfo,
    setUserinfo,
    getuserinfoApi
  }
})

export default useUserStore
