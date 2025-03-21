import request from '@/utils/request'

// jsapi签名
export const getJsApiInfo = (data: { url: string }) => {
  return request<JSApiInfodata>({
    url: '/jsapiTicket',
    method: 'get',
    data
  })
}

// agentJsapi签名
export const getAgentJsApiInfo = (data: { url: string }) => {
  return request<JSApiInfodata>({
    url: '/agentJsapiTicket',
    method: 'get',
    data
  })
}

// jsapi签名-返回数据
interface JSApiInfodata {
  nonceStr: string
  timestamp: number
  signature: string
  agentId: string
  corpId: string
  url?: string
}
