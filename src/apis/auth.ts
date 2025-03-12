import request from '@/utils/request'

// 获取用户信息
export const getJsApiInfo = () => {
  return request<any>({
    url: '/users/getuserinfo',
    method: 'post',
    data: {}
  })
}

// 获取用户信息
export const getAgentJsApiInfo = () => {
  return request<any>({
    url: '/users/getuserinfo',
    method: 'post',
    data: {}
  })
}
