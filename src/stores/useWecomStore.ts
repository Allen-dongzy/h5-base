// 入口类型
export enum Entry {
  contact_profile = 'contact_profile', // 从联系人详情进入
  single_chat_tools = 'single_chat_tools', // 从单聊会话的工具栏进入
  group_chat_tools = 'group_chat_tools', // 从群聊会话的工具栏进入
  chat_attachment = 'chat_attachment', // 从会话的聊天附件栏进入
  single_kf_tools = 'single_kf_tools', // 从微信客服的工具栏进入
  chain_single_chat_tools = 'chain_single_chat_tools', // 上下游单聊会话的工具栏
  chain_group_chat_tools = 'chain_group_chat_tools', // 上下游群聊会话的工具栏
  normal = 'normal' // 除以上场景之外进入，例如工作台，聊天会话等
}

const useWecomStore = defineStore(
  'useWecomStore',
  () => {
    // 企微页面的入口类型
    const entry = ref<Entry>(Entry.normal)
    // 设置入口类型
    const setEntry = (currentEntry: Entry) => {
      entry.value = currentEntry
    }
    // 是否为1v1会话进入
    const is1v1 = computed(() => {
      return [
        Entry.chain_single_chat_tools,
        Entry.single_chat_tools,
        Entry.contact_profile
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
