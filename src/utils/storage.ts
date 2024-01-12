const STORAGE_KEY: string = 'admin-storage'

const storage = {

  //  设置某个模块的缓存项
  set(key: string, val: string | number | object, module_name?: string): any {
    // 有模块名就获取该模块对象，将键值存入该模块，递归将模块名和该模块传入来达到放入缓存的效果
    if (module_name) {
      const storageItem = this.get(module_name)
      storageItem[key] = val
      this.set(module_name, storageItem)
    } else { //无模块名就获取缓存对象，给该对象设置对应的键和值，最后放入缓存
      const storage = this.getStorage() || {}
      storage[key] = val
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    }
  },

  //  获取某个模块的缓存项
  get(key: string, module_name?: string): any {
    // 有模块名则将模块名作为key递归求当前模块的object，如果该对象有效，则返回模块下key对应的子对象
    if (module_name) { // 例如user下的userName
      const storageItem = this.get(module_name)
      if (storageItem) return storageItem[key]
    }
    // 无模块名则直接返回缓存对象中的key对应的对象
    const storage = this.getStorage()
    return storage?.[key] || ''
  },

  //  获取缓存本身
  getStorage(): any {
    // storage本身只能存字符串，所以去除需要json化，方便我们直接调用
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) as string)
  },

  //  清除缓存项
  clear(key: string, module_name?: string): any {
    const storage = this.getStorage()
    if (module_name) { // 有模块名就删除缓存根对象的指定模块下的指定值
      if (!storage[module_name]) return null
      delete storage[module_name][key]
    } else {
      delete storage[key]// 无模块名就删除缓存根对象的指定模块/指定值
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))// 覆盖所有缓存
  }
}


export default storage