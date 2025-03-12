import QRCode, { type QRCodeToDataURLOptions } from 'qrcode'
import dayjs from 'dayjs'

/**
 * 生成二维码图片Base64数据
 * @param content
 * @param width
 * @returns {Promise<unknown>}
 */
export const generateQRCodeBase64 = async (content: string, width: number) => {
  try {
    // 生成二维码图片数据
    const qrCodeOptions: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      version: 5,
      margin: 1,
      width: width
    }
    const qrCodeData = await QRCode.toDataURL(content, qrCodeOptions)
    // 返回Base64格式的图片数据
    return qrCodeData
  } catch (error) {
    console.error('生成二维码失败：', error)
    throw error
  }
}

/**
 * 下载base64图片
 * @param {string} base64
 * @param {string} name
 * @returns {void}
 */
export const downloadBase64Image = (base64: string, name?: string) => {
  const link = document.createElement('a')
  link.href = base64
  link.download = name ? name : `${dayjs().format('YYYYMMDDHHmmss')}.png`
  link.click()
  link.remove()
}
