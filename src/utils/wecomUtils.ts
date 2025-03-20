import * as ww from '@wecom/jssdk'
import type { SignatureData } from '@wecom/jssdk'
import { getJsApiInfo, getAgentJsApiInfo } from '@/apis/wecom'
import { showToast } from 'vant'

// jssdk签名数据
interface JsSdkData {
  jsApiData: SignatureData
  agentJsApiData: SignatureData
  agentData: { corpId: string; agentId: string }
}
const jsSdkData: JsSdkData = {
  // 微信应用jssdk签名数据
  jsApiData: {
    timestamp: '',
    nonceStr: '',
    signature: ''
  },
  // 企微内建应用jssdk签名数据
  agentJsApiData: {
    timestamp: '',
    nonceStr: '',
    signature: ''
  },
  // 企微信息
  agentData: {
    corpId: '',
    agentId: ''
  }
}

// 初始化
export const init = async () => {
  const { res: jsApiRes, err: jsApiErr } = await getJsApiInfo({
    url: window.location.href.split('#')[0]
  })
  if (jsApiErr) return showToast('获取jsapi签名失败')
  jsSdkData.jsApiData = {
    timestamp: jsApiRes.data.timestamp!,
    nonceStr: jsApiRes.data.nonceStr!,
    signature: jsApiRes.data.signature!
  }
  const { res: agentJsApiRes, err: agentJsApiErr } = await getAgentJsApiInfo({
    url: window.location.href.split('#')[0]
  })
  if (agentJsApiErr) return showToast('获取agentJsApi签名失败')
  jsSdkData.agentJsApiData = {
    timestamp: agentJsApiRes.data.timestamp!,
    nonceStr: agentJsApiRes.data.nonceStr!,
    signature: agentJsApiRes.data.signature
  }
  jsSdkData.agentData = {
    corpId: agentJsApiRes.data.corpId!,
    agentId: agentJsApiRes.data.agentId!
  }
  if (!jsSdkData.jsApiData.signature || !jsSdkData.agentJsApiData.signature)
    return showToast('签名信息不全')
  register()
}

// 注册
const register = () => {
  const { corpId, agentId } = jsSdkData.agentData
  ww.register({
    // 企业ID
    corpId,
    // 应用AgentId
    agentId,
    // 需要使用的JSAPI列表
    jsApiList: getJsApiList(),
    // 获取微信应用jssdk签名
    getConfigSignature,
    // 获取企微内建应用jssdk签名
    getAgentConfigSignature,
    // 微信sdk注册失败
    onConfigFail: (err) => {
      console.log('jssdk注册失败:\n', err)
    },
    // 企微内建应用sdk注册失败
    onAgentConfigFail: (err) => {
      console.log('agentJssdk注册失败:\n', err)
    }
  })
}

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

// 获取微信应用jssdk签名
const getConfigSignature = () => {
  const { timestamp, nonceStr, signature } = jsSdkData.jsApiData
  return { timestamp, nonceStr, signature }
}

// 获取企微内建应用jssdk签名
const getAgentConfigSignature = () => {
  const { timestamp, nonceStr, signature } = jsSdkData.agentJsApiData
  return { timestamp, nonceStr, signature }
}
