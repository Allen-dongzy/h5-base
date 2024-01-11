import storage from '@/utils/storage'

const useAppStore = defineStore('useAppStore', () => {
  // 路由栈
  const routeStack = ref<string[]>(storage.get('routeStack') || [])
  // 设置路由栈
  const setRouteStack = (routeName: string) => {
    // 查询当前路由名称在路由栈中的索引
    const routeIndex = routeStack.value.findIndex((item) => item === routeName)
    // 如果不存在,则添加到路由栈中(前进) 如果存在,则删除当前路由名称之后的路由(回退)
    if (routeIndex === -1) {
      routeStack.value.push(routeName)
    } else {
      routeStack.value.splice(routeIndex + 1)
    }
    storage.set('routeStack', routeStack.value)
  }
  // 清空路由栈
  const clearRouteStack = () => {
    routeStack.value = []
    storage.set('routeStack', [])
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

  return {
    routeStack,
    setRouteStack,
    clearRouteStack,
    lang,
    langList,
    setLang
  }
})

export default useAppStore
