import storage from '@/utils/storage'

const useAppStore = defineStore('useAppStore', () => {
  // 缓存组件列表
  const keepAliveList = ref<string[]>(storage.get('keepAliveList') || [])
  // 设置缓存组件列表
  const setKeepAliveList = (routerName: string) => {
    const keepAliveIndex = keepAliveList.value.findIndex((keepAliveRouterName: string) => keepAliveRouterName === routerName)
    if (keepAliveIndex >= 0) {
      keepAliveList.value.splice(keepAliveIndex + 1)
    } else {
      keepAliveList.value.push(routerName)
    }
    console.log('keepAliveList', keepAliveList.value)
  }
  // 删除缓存组件项
  const removeKeepAliveItem = (routerName: string) => {
    const removeKeepAliveIndex = keepAliveList.value.findIndex((keepAliveRouterName: string) => keepAliveRouterName === routerName)
    if (removeKeepAliveIndex >= 0) {
      keepAliveList.value.splice(removeKeepAliveIndex)
    }
  }

  // 语言类型
  type Lang = 'zh' | 'en'
  // 语言列表
  const langs: Lang[] = ['zh', 'en']
  const langList = ref<Lang[]>(langs)
  // 语言
  const lang = ref<Lang>(storage.get('lang') || 'zh')
  // 设置语言
  const setLang = (currentLang: Lang) => {
    lang.value = currentLang
    storage.set('lang', lang.value)
  }

  // 窗口宽度
  const windowWidth = ref(window.innerWidth)
  // 设置窗口宽度
  const setWindowWidth = (width: number) => {
    windowWidth.value = width
  }
  // 是否为桌面端
  const isDesktop = ref(windowWidth.value >= 768)
  // 是否为移动端
  const isMobile = ref(windowWidth.value < 768)

  return {
    keepAliveList,
    setKeepAliveList,
    removeKeepAliveItem,
    lang,
    langList,
    setLang,
    windowWidth,
    setWindowWidth,
    isDesktop,
    isMobile
  }
})

export default useAppStore
