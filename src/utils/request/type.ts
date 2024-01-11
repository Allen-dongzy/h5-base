// 请求头格式
export type IContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'

// 请求方法
export type IMethod = 'get' | 'post' | 'put' | 'delete'

// 请求失败不显示提示
export interface IRequestConfig {
  errNoTip?: boolean
}

// 请求体
export interface IRequestData<T = any> extends IRequestConfig {
  data: T
  method: IMethod
  url: string
  headers?: {
    'Content-Type'?: IContentType
    responseType?: 'blob'
  }
  contentType?: IContentType
  responseType?: 'blob'
}

// 返回体
export interface IResponseData<T = any> {
  [index: number]: number
  code?: number
  data?: T
  code_dec?: string
  name?: string
}
