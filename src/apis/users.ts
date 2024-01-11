import request from '@/utils/request'

// 获取用户信息
export const getuserinfo = () => {
  return request({
    url: '/users/getuserinfo',
    method: 'post',
    data: {}
  })
}
