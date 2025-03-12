import { isNumber } from 'lodash-es'

export interface IUnknownTime {
  Y: number
  M: number
  D: number
  h: number
  m: number
  s: number
}

/**
 * 时间戳转换为常用时间形式
 * (默认转换为对象格式)
 * @param {number | string} timestamp 时间戳
 * @param {string} mode 要转换成的模式
 * @returns {Date | Object | string | null} 可以渲染的时间格式
 */
const toTime = (
  timestamp: number | string,
  mode: string = 'Object'
): Date | object | string | null => {
  if (!timestamp) return null
  const timeLen = timestamp.toString().length
  if (timeLen !== 10 && timeLen !== 13) return null
  timestamp = timeLen === 13 ? Number(timestamp) : Number(timestamp) * 1000
  const date = new Date(timestamp)
  const Y = numberFormat(date.getFullYear())
  const M = numberFormat(date.getMonth() + 1)
  const D = numberFormat(date.getDate())
  const h = numberFormat(date.getHours())
  const m = numberFormat(date.getMinutes())
  const s = numberFormat(date.getSeconds())
  let result = null
  switch (mode) {
    case 'Date':
      result = new Date(timestamp)
      break
    case 'Object':
      result = { Y, M, D, h, m, s }
      break
    case '-':
      result = `${Y}-${M}-${D} ${h}:${m}:${s}`
      break
    case '/':
      result = `${Y}/${M}/${D} ${h}:${m}:${s}`
      break
  }
  return result
}

/**
 * 常用时间形式转换为时间戳
 * @param {Date | string | IUnknownTime} unknownTime 未知的时间形式
 * @param {number} len 时间戳长度
 * @returns {number | null} 时间戳
 */
const toTimestamp = (
  unknownTime: Date | string | IUnknownTime,
  len: number = 13
): number | null => {
  if (!unknownTime) return null
  let result: number | null = null
  const type = getType(unknownTime)
  if (type === 'Date') {
    result = (unknownTime as Date).getTime()
  } else if (type === 'Object') {
    const { Y, M, D, h, m, s } = unknownTime as IUnknownTime
    result = new Date(Y, M - 1, D, h, m, s).getTime()
  } else if (type === 'String') {
    const date = (unknownTime as string).split(' ')[0]
    const time = (unknownTime as string).split(' ')[1]
    const timeArr: Array<any> = time.split(':')
    let dateArr: Array<any> = []
    if (~date.indexOf('/')) {
      dateArr = date.split('/')
    } else if (~date.indexOf('-')) {
      dateArr = date.split('-')
    }
    result = new Date(
      dateArr[0],
      dateArr[1] - 1,
      dateArr[2],
      timeArr[0],
      timeArr[1],
      timeArr[2]
    ).getTime()
  }
  if (len === 10) (result as number) /= 1000
  return result
}

/**
 * 若只有一个时间戳，则计算指定时间戳与当前时间戳的的差值
 * 若有两个时间戳，则计算两个指定时间戳之间的差值
 * @param {number | string} timeStamp1 第一个时间戳
 * @param {number | string | null} timeStamp2 第二个时间戳
 * @returns {number} 时间戳差值
 */
const timeStampDiff = (
  timeStamp1: number | string,
  timeStamp2: number | string | null = null
): number => {
  if (!timeStamp2) {
    timeStamp2 = timeStamp1
    timeStamp1 = Date.now()
  }
  return (timeStamp2 as number) - (timeStamp1 as number)
}

/**
 * 时间戳差值转换为时间间隔
 * (做倒计时使用)
 * @param {number} timeStamp 时间戳差值
 * @returns {{D: string, h: string, m: string, s: string} | null} 倒计时对象，里面含有天时分秒
 */
const toInterval = (
  timeStamp: number
): { D: string | number; h: string | number; m: string | number; s: string | number } | null => {
  const D = numberFormat(parseInt((timeStamp / 86400).toString())) as string | number
  timeStamp = timeStamp % 86400
  const h = numberFormat(parseInt((timeStamp / 3600).toString())) as string | number
  timeStamp = timeStamp % 3600
  const m = numberFormat(parseInt((timeStamp / 60).toString())) as string | number
  timeStamp = timeStamp % 60
  const s = numberFormat(parseInt(timeStamp.toString())) as string | number
  return { D, h, m, s }
}

/**
 * 若传入正确的时间字符串以及指定格式，则将时间转换为指定的平台
 * 若传入正确的时间字符串却没有传入格式，时间将在iOS和非iOS平台之间相互转换
 * @param {string} time 时间字符串
 * @returns {string | null} 转换后的时间字符串
 */
const timePlatformTransform = (time: string, mode: string = '/'): string => {
  if (!time) return time
  const date = time.split(' ')[0]
  if (mode === '/' && ~date.indexOf('-')) {
    time = time.replace(/-/g, '/')
  } else if (mode === '-' && ~date.indexOf('/')) {
    time = time.replace(/\//g, '-')
  } else if (!mode && ~date.indexOf('-')) {
    time = time.replace(/-/g, '/')
  } else if (!mode && ~date.indexOf('/')) {
    time = time.replace(/\//g, '-')
  }
  return time
}

/**
 * 数字格式化
 * @param {number | string} num 数字
 * @param {number} len 长度(默认为2)
 * @returns {null | string | number} 格式化后的数字
 */
const numberFormat = (num: number | string, len: number = 2): null | string | number => {
  if (!num && num !== 0) return null
  let numLength = num.toString().length
  while (numLength++ < len) {
    num = '0' + num
  }
  return num
}

/**
 * 获取变量的类型
 * @param {any} variable 被判断的变量
 * @returns {string | null} 变更量的类型(大写)
 */
const getType = (variable: any): string | null => {
  if (!variable) return null
  return Object.prototype.toString.call(variable).replace(/^\[object (\S+)]$/, '$1')
}

/**
 * 隐藏手机号
 * @param {number | string} mobile 手机号
 * @returns {string | null} 中间四位被隐藏的手机号
 */
const hideMobile = (mobile: number | string): string | null => {
  if (!mobile) return null
  mobile = mobile as string
  return `${mobile.slice(0, 3)}****${mobile.slice(7, 11)}`
}

/**
 * 写入文本到粘贴板
 * @param {string} text 要写入的文本
 * @returns {Promise<[null, boolean] | [string | undefined]>} 执行成功与否的Promise结果
 */
const setClipboard = (text: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 数字没有 .length 不能执行selectText 需要转化成字符串
    const textString = text.toString()
    let input: HTMLInputElement | null = document.querySelector('#copy-input')
    if (!input) {
      input = document.createElement('input')
      input.id = 'copy-input'
      input.readOnly = true // 防止ios聚焦触发键盘事件
      input.style.position = 'absolute'
      input.style.top = '50%'
      input.style.left = '50%'
      input.style.zIndex = '-1000'
      input.style.transform = 'translateX(-50%) translateY(-50%)'
      document.body.appendChild(input)
    }

    input.value = textString
    // ios必须先选中文字且不支持 input.select()
    selectText(input, 0, textString.length)
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      document.body.removeChild(input)
    } else reject('复制失败')
    input.blur()
    resolve(true)

    // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
    function selectText(textbox: HTMLInputElement | null, startIndex: number, stopIndex: number) {
      const { setSelectionRange, focus } = textbox as HTMLInputElement
      setSelectionRange(startIndex, stopIndex)
      focus()
    }
  })
    .then((res) => [null, res])
    .catch((err) => [err])
}

/**
 * 获取视频封面
 * @param {any} event 要获取的视频url
 * @returns {Promise<string>} 执行成功的Promise结果
 */
const getVideoCover = (event: any) => {
  return new Promise((resolve) => {
    const videoEle = event.target // 当前video dom节点
    videoEle.currentTime = 1 // 设置视频开始播放时间（因为有些手机第一帧显示黑屏，所以这里选取视频的第一秒作为封面）
    videoEle.addEventListener('canplay', function () {
      // 监听video的canplay事件
      // 创建canvas元素 并设置canvas大小等于video节点的大小
      const canvas = document.createElement('canvas')
      const scale = 0.8 // 压缩系数
      canvas.width = videoEle.videoWidth * scale
      canvas.height = videoEle.videoHeight * scale
      // canvas画图
      canvas!.getContext('2d')!.drawImage(videoEle, 0, 0, canvas.width, canvas.height)
      // 把canvas转成base64编码格式
      const imgSrc = canvas.toDataURL('image/png')
      resolve(imgSrc)
    })
  })
}

/**
 * 防抖
 * @param {Function} callback 回调函数
 * @param {number} delay 触发时常
 * @returns {(function(): void)} 无
 */
const debounce = (callback: Function, delay: number = 800): Function => {
  let timer: any // 闭包存定时器状态
  return function (this: any, args?: any) {
    if (timer) clearTimeout(timer) // 清除定时器
    timer = setTimeout(() => {
      // 回调
      callback.call(this, args)
    }, delay)
  }
}

/**
 * 节流
 * @param {Function} callback 回调函数
 * @param {number} delay 触发时常
 * @returns {(function(): void)} 无
 */
const throttle = (callback: Function, delay: number = 800) => {
  let isFirst = true
  let start = Date.now() // 闭包存起始时间
  return function (this: any, args?: any) {
    if (isFirst) {
      // 第一次触发
      callback.apply(this, args)
      start = Date.now()
      isFirst = false
      return
    }
    if (Date.now() - start > delay) {
      // 满足间隔时长触发
      callback.apply(this, args)
      start = Date.now()
    }
  }
}

/**
 * 对象键字典排序
 * @param {object} obj 需要排序的对象
 * @returns {object} 排序后的对象
 */
const objKeySort = (obj: Record<string, any>) => {
  const objKeys = Object.keys(obj).sort()
  const newObj: Record<string, any> = {}
  for (let i = 0; i < objKeys.length; i++) {
    newObj[objKeys[i]] = obj[objKeys[i]]
  }
  return newObj
}

/**
 * 对象属性值去空
 * @param {object} obj 待检查的对象
 * @returns {object} 过滤掉空属性后的对象
 */
const objRemoveEmpty = (obj: Record<string, any>): object => {
  const objKeys = Object.keys(obj)
  const newObj: Record<string, any> = {}
  for (let i = 0; i < objKeys.length; i++) {
    if (obj[objKeys[i]] || obj[objKeys[i]] === 0 || obj[objKeys[i]] === false)
      newObj[objKeys[i]] = obj[objKeys[i]]
  }
  return newObj
}

/**
 * 将对象转为url的query参数
 * @param obj
 * @returns query字符串
 */
const objToQuery = (obj: Record<string, any>): string => {
  const objKeys = Object.keys(obj)
  let query = ''
  for (let i = 0; i < objKeys.length; i++) {
    query += `${i > 0 ? '&' : '?'}${objKeys[i]}=${obj[objKeys[i]]}`
  }
  return query
}

/**
 * 将url的query参数转为对象
 * @param query
 * @returns query对象
 */
const queryToObj = (query: string): Record<string, any> => {
  if (query?.[0] === '?') query = query.slice(1)
  const queryArr = query.split('&')
  const obj: Record<string, any> = {}
  for (let i = 0; i < queryArr.length; i++) {
    const queryItem = queryArr[i].split('=')
    obj[queryItem[0]] = queryItem[1]
  }
  return obj
}

/**
 * 下载文件
 * @param {any} res 结果
 * @param {string} type 文件名
 * @returns void
 */
const downloadFile = (res: any, name: string = '', type = 'xlsx') => {
  // 文件名
  let fileName = res.headers?.['content-disposition']?.split('=')?.[1]
    ? decodeURI(res.headers['content-disposition'].split('=')[1])
    : name
  // 特殊处理名称所包含的特殊字符
  fileName = fileName.indexOf("''") > -1 ? fileName.split("''")[1] : fileName
  // 不是Excel取名方式需要变更
  if (type !== 'xlsx') {
    fileName = decodeURI(res.headers?.['content-disposition'].split('; ')[1])
  }
  // 文件
  const file = new Blob([res.data], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  a.remove()
}

/**
 * 选择文件
 * @param {any} res 结果
 * @param {string} accept 文件类型
 * @returns file
 */
const selectFile = ({ max = 1, accept = '*' }) => {
  return new Promise<File[]>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept // 可以根据需要指定文件类型
    input.style.display = 'none'
    if (max > 1) input.multiple = true

    input.addEventListener('change', (event: Event) => {
      const inputTarget = event.target as HTMLInputElement
      if (inputTarget.files && inputTarget.files.length > 0) {
        const file = Array.from(inputTarget.files).slice(0, max)
        resolve(file) // 成功选择文件
      } else {
        reject() //失败
      }
    })

    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  })
    .then((res) => ({ err: null, res }))
    .catch((err: string) => ({ err, res: null }))
}

/**
 * 下载文件
 * @param {number | string} px 结果
 * @param {number} width 设计稿宽度
 * @returns 转化后的宽度
 */
const pxToVw = (px: number | string, width = 750) => {
  if (!isNumber(px)) {
    return px
  }
  return `${(Number(px) / width) * 100}vw`
}

export {
  toTime, // 时间戳转换为常用时间形式
  toTimestamp, // 常用时间形式转换为时间戳
  timeStampDiff, // 计算时间戳的差值
  toInterval, // 时间戳转换为时间间隔
  timePlatformTransform, // 时间平台转换
  numberFormat, // 数字格式化
  getType, // 获取变量的类型
  hideMobile, // 隐藏手机号
  setClipboard, // 写入文本到粘贴板
  getVideoCover, // 获取视频封面
  debounce, // 防抖
  throttle, // 节流
  objKeySort, // 对象键字典排序
  objRemoveEmpty, // 对象属性值去空
  objToQuery, // 将对象转为url的query参数
  queryToObj, // 将url的query参数转为对象
  downloadFile, // 下载文件
  selectFile, // 选择文件
  pxToVw // px转vw
}
