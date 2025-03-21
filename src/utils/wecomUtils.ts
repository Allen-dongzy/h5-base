import * as ww from '@wecom/jssdk'
import type { NewsMessage } from '@wecom/jssdk'
import { getJsApiInfo, getAgentJsApiInfo } from '@/apis/wecom'
import { showToast } from 'vant'

// 获取要使用的JSAPI列表
const getJsApiList = () => {
  return [
    'selectExternalContact',
    'showOptionMenu',
    'hideOptionMenu',
    'sendChatMessage',
    'getContext',
    'getCurExternalContact',
    'previewFile',
    'scanQRCode',
    'launchMiniprogram',
    'openEnterpriseChat'
  ]
}

// 注册
export const register = async () => {
  const { res, err } = await getJsApiInfo({ url: window.location.href.split('#')[0] })
  if (err) {
    showToast('获取企业信息失败')
    return false
  }
  const { corpId, agentId } = res.data
  return new Promise((resolve, reject) => {
    ww.register({
      // 企业ID
      corpId,
      // 应用AgentId
      agentId,
      // 需要使用的JSAPI列表
      jsApiList: getJsApiList(),
      // 获取微信应用jssdk签名
      getConfigSignature: async (url) => {
        const { res, err } = await getJsApiInfo({ url })
        if (err) return { timestamp: '', nonceStr: '', signature: '' }
        const { timestamp, nonceStr, signature } = res.data
        return { timestamp, nonceStr, signature }
      },
      // 微信sdk注册成功
      onConfigSuccess: (res) => {
        console.log('jssdk注册成功:\n', res)
      },
      // 微信sdk注册失败
      onConfigFail: (err) => {
        console.log('jssdk注册失败:\n', err)
      },
      // 微信sdk注册完成
      onConfigComplete: (res) => {
        console.log('jssdk注册完成:\n', res)
      },
      // 获取企微内建应用jssdk签名
      getAgentConfigSignature: async (url) => {
        const { res, err } = await getAgentJsApiInfo({ url })
        if (err) return { timestamp: '', nonceStr: '', signature: '' }
        const { timestamp, nonceStr, signature } = res.data
        return { timestamp, nonceStr, signature }
      },
      // 企微内建应用sdk注册成功
      onAgentConfigSuccess: (res) => {
        console.log('agentJssdk注册成功:\n', res)
        resolve(true)
      },
      // 企微内建应用sdk注册失败
      onAgentConfigFail: (err) => {
        console.log('agentJssdk注册失败:\n', err)
        reject(false)
      },
      // 企微内建应用sdk注册完成
      onAgentConfigComplete: (res) => {
        console.log('agentJssdk注册完成:\n', res)
      }
    })
  })
}

// 获取当前入口环境
export const getContext = async () => {
  try {
    const res = await ww.getContext()
    return res
  } catch (err) {
    console.log('getContext-err', err)
  }
}

// 发送消息给外部联系人-文字
export const sendChatMessageForText = async (content: string, enterChat: boolean = true) => {
  try {
    const res = await ww.sendChatMessage({
      msgtype: 'text',
      enterChat,
      text: {
        content
      }
    })
    return res
  } catch (err) {
    console.log('sendChatMessage-text-err', err)
  }
}

// 发送消息给外部联系人-图片
export const sendChatMessageForImage = async (mediaid: string, enterChat: boolean = true) => {
  try {
    const res = await ww.sendChatMessage({
      msgtype: 'image',
      enterChat,
      image: {
        mediaid
      }
    })
    return res
  } catch (err) {
    console.log('sendChatMessage-image-err', err)
  }
}

// 发送消息给外部联系人-视频
export const sendChatMessageForVideo = async (mediaid: string, enterChat: boolean = true) => {
  try {
    const res = await ww.sendChatMessage({
      msgtype: 'video',
      enterChat,
      video: {
        mediaid
      }
    })
    return res
  } catch (err) {
    console.log('sendChatMessage-video-err', err)
  }
}

// 发送消息给外部联系人-链接
export const sendChatMessageForNews = async (
  news: NewsMessage['news'],
  enterChat: boolean = true
) => {
  try {
    const res = await ww.sendChatMessage({
      msgtype: 'news',
      enterChat,
      news
    })
    return res
  } catch (err) {
    console.log('sendChatMessage-video-err', err)
  }
}
