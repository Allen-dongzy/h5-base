import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { showDialog, showToast } from 'vant'
import { objRemoveEmpty, objKeySort, objToQuery, debounce } from '@/utils/tools'
import useUserStore from '@/stores/useUserStore'

// 需要根据项目来配置-start
// 接口状态码属性名
const interfaceCodeName: 'code' | 'status' = 'code'

// 接口状态码类型
enum InterfaceCode {
  success = '200',
  authorization = '401'
}
// 需要根据项目来配置-end

// ContentType类型
enum ContentType {
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  json = 'application/json'
}

// 创建对象
const Server: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL_PREFIX,
  timeout: 30000
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

// http请求错误处理
const httpErrorHandler = (err: AxiosError<Request.ResponseData>) => {
  // 这里是HTTP返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
  }
  // 弹出提示
  showDialog({
    title: err?.message || '错误',
    message: `
      httpStatus: ${err?.response?.status || '无'}\n
      接口Status: ${err?.response?.data?.[interfaceCodeName] || '无'}\n
      请求method: ${err?.config?.method || '无'}\n
      请求Content-Type: ${err?.config?.headers?.['Content-Type'] || '无'}\n
      请求url: ${err?.config?.url || '无'}
    `
  })
}

// 下载excel文件
const downloadFile = (res: AxiosResponse) => {
  // 文件名
  let fileName = res.headers?.['content-disposition']?.split('=')?.[1] ? decodeURI(res.headers['content-disposition'].split('=')[1]) : '文件'
  // 特殊处理名称所包含的特殊字符
  fileName = fileName.indexOf('\'\'') > -1 ? fileName.split('\'\'')[1] : fileName
  // 文件
  const file = new Blob([res.data], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  a.remove()
}

// 响应拦截器
Server.interceptors.response.use(
  // 拦截到响应对象，将响应对象的 data 属性返回给调用的地方
  (res) => {
    const data = res.data as Request.ResponseData
    // 如果是Blob类型的数据，直接下载文件
    if (data instanceof Blob) {
      downloadFile(res)
      return Promise.resolve({ data: res } as AxiosResponse<any, any>)
    }
    // 如果没有code直接返回数据
    if (!Object.prototype.hasOwnProperty.call(data, interfaceCodeName)) return Promise.resolve(res)
    // 接口错误处理
    if (![InterfaceCode.success].includes(data[interfaceCodeName] as any)) {
      if ([InterfaceCode.authorization].includes(data[interfaceCodeName] as any)) {
        showToast('登录验证失败,请重新登录')
        goLogin()
      } else if (!(res.config as Request.RequestData).errNoTip) {
        showToast(data.message || '请求失败')
      }
      return Promise.reject(res)
    }
    return Promise.resolve(res)
  },
  (err: AxiosError<Request.ResponseData>) => {
    // http错误处理
    httpErrorHandler(err)
    Promise.reject(err)
  }
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
const request = async <T = any>(requestData: Request.RequestData) => {
  // 参数转换
  transRequestData(requestData)
  // Promise的then和catch处理包装
  return (Server<Request.ResponseData<T>>(requestData))
    .then((res) => {
      return { err: null, res: res.data }
    })
    .catch((err: AxiosResponse<Request.ResponseData>) => {
      return { err: err.data, res: null }
    })
}

export default request
