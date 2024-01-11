import storage from '@/utils/storage'

// 使用url跳转路径
const useUrlToJump = () => {

  // 当前待跳转url
  const url = ref<string>(storage.get('urlToJump') || '')

  // 写入url
  const writeUrl = (urlToJump?: string) => {
    // 若没有url或为空url则清空待跳转url
    if (!urlToJump) {
      url.value = ''
      storage.set('urlToJump', '')
      return
    }
    // 保存待跳转路径
    url.value = urlToJump
    storage.set('urlToJump', url)
  }

  // 替换url
  const replaceUrl = () => {
    // 跳转url
    window.location.replace(url.value)
    // 清空store和缓存中的待跳转url
    writeUrl('')
  }

  return {
    url,
    writeUrl,
    replaceUrl
  }
}

export default useUrlToJump