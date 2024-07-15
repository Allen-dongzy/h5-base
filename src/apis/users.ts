import request from '@/utils/request'

// 获取用户信息
export const getuserinfo = () => {
  return request({
    url: '/users/getuserinfo',
    method: 'post',
    data: {}
  })
}

// 扫码登录
export const qrLogin = (data: any) => {
  return request({
    url: '/users/qrLogin',
    method: 'post',
    data
  })
}

// debug登录
export const debugLogin = (userId: string) => {
  return request({
    url: `/users/loginDebug/${userId}`,
    method: 'post',
    data: {}
  })
}