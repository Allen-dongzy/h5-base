import { EntryType } from '@wecom/jssdk'

const useWecomStore = defineStore(
  'useWecomStore',
  () => {
    // 企微页面的入口类型
    const entry = ref<EntryType>(EntryType.normal)
    // 设置入口类型
    const setEntry = (currentEntry: EntryType) => {
      entry.value = currentEntry
    }
    // 是否为1v1会话进入
    const is1v1 = computed(() => {
      return [
        EntryType.chain_single_chat_tools,
        EntryType.single_chat_tools,
        EntryType.contact_profile
      ].includes(entry.value)
    })

    // 外部联系人id
    const externalUserId = ref('')
    // 设置外部联系人id
    const setExternalUserId = (id: string) => {
      externalUserId.value = id
    }

    return {
      entry,
      setEntry,
      is1v1,
      externalUserId,
      setExternalUserId
    }
  },
  {
    persist: true
  }
)

export default useWecomStore
