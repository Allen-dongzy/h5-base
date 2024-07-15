import storage from '@/utils/storage'
import { qrLogin, debugLogin, getuserinfo } from '@/apis/users'
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
  const userinfoApi = async () => {
    const [err, res] = await getuserinfo()
    if (err) return
    setUserinfo(res.info)
  }

  // DEBUG登录
  const debugLoginApi = async (userId: string) => {
    const [err, res] = await debugLogin(userId)
    if (err) return false
    setToken(res.data)
    await userinfoApi()
    return true
  }

  // 扫码登录
  const qrLoginApi = async (code: string) => {
    const data = { code }
    const [err, res] = await qrLogin(data)
    if (err) return false
    setToken(res.data)
    await userinfoApi()
    return true
  }

  return {
    token,
    setToken,
    userinfo,
    setUserinfo,
    userinfoApi,
    debugLoginApi,
    qrLoginApi
  }
})

export default useUserStore
