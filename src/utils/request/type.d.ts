

declare module Request {
  // 请求头格式
  export type ContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'

  // 请求方法
  export type Method = 'get' | 'post' | 'postForm' | 'put' | 'delete'

  // 请求失败不显示提示
  export interface RequestConfig {
    errNoTip?: boolean
  }

  // 请求体
  export interface RequestData<T = any> extends RequestConfig {
    data: T
    method: Method
    url: string
    headers?: {
      'Content-Type'?: ContentType
      responseType?: 'blob'
    }
    contentType?: ContentType
    responseType?: 'blob'
    timeout?: number
  }

  // 返回体
  export interface ResponseData<T = any> extends Record<string, any> {
    code?: number | string
    message: string
    messageEN: string
    data: T
    traceId: string
    success: boolean
  }
}