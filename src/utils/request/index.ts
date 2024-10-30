import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { objRemoveEmpty, objKeySort, objToQuery, debounce } from '@/utils/tools'
import useUserStore from '@/stores/useUserStore'

// ContentType类型
enum ContentType {
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  json = 'application/json'
}

// 创建对象
const Server: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL_PREFIX,
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
    (config.headers as any).token = token.value
  }
}

// 设置url
const setUrl = (config: AxiosRequestConfig) => {
  if (config.headers!['Content-Type'] === ContentType.formUrlencoded) {
    // 若请求头是formUrlencoded,就将data参数滤并排序再query化并添加到url(某些接口会有post请求但是请求头又是表单的极端情况)
    config.url += `${objToQuery(objKeySort(objRemoveEmpty(config.data)))}`
  } else {
    // 普通赋值
    config.url = `${config.url}`
  }
}

// 设置请求内容
const setData = (config: AxiosRequestConfig) => {
  // 若data是FormData类型,就不做处理
  if (config.headers!['Content-Type'] === ContentType.formData) return
  if (config.headers!['Content-Type'] === ContentType.formUrlencoded) {
    // 若请求头是formUrlencoded,就清空data(参数为query)
    config.data = {}
  } else {
    // 将data中的值做一层空值过滤并且字典排序
    config.data = objKeySort(objRemoveEmpty(config.data))
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
  (res: AxiosResponse<Request.ResponseData>) => {
    const data = res.data as Request.ResponseData
    if (data instanceof Blob) return Promise.resolve(res)
    if (!Object.prototype.hasOwnProperty.call(data, 'code')) return Promise.resolve(data)
    if (data.code !== '200') {
      if (['700'].includes(data.code as string)) {
        message.error('登录验证失败,请重新登录')
        goLogin()
      } else if (!(res.config as Request.RequestData).errNoTip) {
        message.error(data.message || '请求失败')
      }
      return Promise.reject(data)
    }
    return Promise.resolve(data as any)
  },
  (err) => Promise.reject(err)
)

// 前往登录
const goLogin = debounce(() => {
  // 清空token,用户信息
  const { setToken, setUserinfo } = useUserStore()
  setToken()
  setUserinfo()
  // 跳转到登陆页
  const baseURL = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL
  if (import.meta.env.DEV) {
    window.location.replace(`${baseURL}/debug?redirect=${encodeURIComponent(window.location.href)}`)
  } else {
    window.location.replace(`${baseURL}/login?redirect=${encodeURIComponent(window.location.href)}`)
  }
})

// 获取默认的ContentType
const getContentType = (method: string) => {
  if (method === 'get') {
    return ContentType.formUrlencoded
  } else if (method === 'postform') {
    return ContentType.formData
  } else {
    return ContentType.json
  }
}

// 参数转换
const transRequestData = (requestData: Request.RequestData) => {
  requestData.headers = requestData.headers || {}
  // 设置请求头
  if (requestData.contentType) {
    requestData.headers['Content-Type'] = requestData.contentType
    delete requestData.contentType
  } else {
    requestData.headers['Content-Type'] = getContentType(requestData.method.toLowerCase())
  }
  // postForm转post
  if (requestData.method === 'postForm') {
    requestData.method = 'post'
  }
}

// 请求request
const request = async (requestData: Request.RequestData) => {
  // 参数转换
  transRequestData(requestData)
  // Promise的then和catch处理包装
  return (Server(requestData) as Promise<any>)
    .then((res) => [null, res])
    .catch((err) => [err, null])
}

export default request
