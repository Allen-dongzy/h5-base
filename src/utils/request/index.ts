import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { objRemoveEmpty, objKeySort, objToQuery } from '@/utils/tools'
import type { RequestData, ResponseData, ContentType } from './type'
import useUrlToJump from '@/composables/useUrlToJump'
import useUserStore from '@/stores/useUserStore'

// 创建对象
const Server: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_HOST + import.meta.env.VITE_APP_API_URL_PREFIX,
  timeout: 10000
})

// 设置请求头
const setHeader = (config: AxiosRequestConfig) => {
  // 用户商店
  const userStore = useUserStore()
  // token
  const { token } = storeToRefs(userStore)
  // 判断是否走JWT
  if (token.value) {
    (config.headers as any).authorization = token.value
  }
}

// 设置url
const setUrl = (config: AxiosRequestConfig) => {
  config.url = `${config.url}`
}

// 设置请求内容
const setData = (config: AxiosRequestConfig) => {
  // 将data中的值做一层空值过滤并且字典排序
  config.data = objKeySort(objRemoveEmpty(config.data))
  // 若是get请求就将data参数query化并添加到url后,最后清空data
  if (config.method?.toLowerCase() === 'get') {
    config.url += `${objToQuery(config.data)}`
    config.data = {}
  }
}

// 请求拦截器
Server.interceptors.request.use(
  (config) => {
    setHeader(config)
    setUrl(config)
    setData(config)
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
Server.interceptors.response.use(
  // 拦截到响应对象，将响应对象的 data 属性返回给调用的地方
  (res: AxiosResponse<ResponseData>) => {
    const data = res.data as ResponseData
    if (data instanceof Blob) return Promise.resolve(data)
    if (!Object.prototype.hasOwnProperty.call(data, 'code')) return Promise.resolve(data)
    if (data.code !== 1) {
      if ([203, 204].includes(data.code as number)) {
        message.error('登录状态失效,正在前往登录...')
        // 清空token,用户信息
        const { setToken, setUserinfo } = useUserStore()
        setToken()
        setUserinfo()
        // 设置当前url为待跳转url,登陆成功后恢复跳转
        const { writeUrl } = useUrlToJump()
        writeUrl(window.location.href)
        // 跳转到登陆页
        window.location.replace('/login')
      } else if (!(res.config as RequestData).errNoTip) {
        message.error(data.code_dec || '请求失败')
      }
      return Promise.reject(data)
    }
    return Promise.resolve(data as any)
  },
  (err) => Promise.reject(err)
)


// 获取请求头ContentType
const contentType: Record<string, ContentType> = {
  'get': 'application/x-www-form-urlencoded',
  'post': 'application/json'
}

// 参数转换
const transRequestData = (requestData: RequestData) => {
  requestData.headers = requestData.headers || {}
  if (requestData.contentType) {
    requestData.headers['Content-Type'] = requestData.contentType
    delete requestData.contentType
  } else {
    requestData.headers['Content-Type'] = contentType[requestData.method.toLowerCase()]
  }
  if (requestData.responseType) {
    requestData.headers['responseType'] = requestData.responseType
    delete requestData.responseType
  }
}

// 请求request
const request = async (requestData: RequestData) => {
  // 参数转换
  transRequestData(requestData)
  // Promise的then和catch处理包装
  return (Server(requestData) as Promise<any>)
    .then((res) => [null, res])
    .catch((err) => [err, null])
}

export default request
