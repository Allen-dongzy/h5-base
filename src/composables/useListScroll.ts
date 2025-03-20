import { ref, onActivated, type ComponentPublicInstance } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

type ListRef = Element | ComponentPublicInstance | null

export default () => {
  // 滚动位置列表
  const scrollTops = ref<Array<number>>([])
  // 元素列表
  const listRefs = ref<Array<Element>>([])
  // 绑定元素列表
  const setListRefs = (el: ListRef, index: number) => {
    listRefs.value[index] = el as Element
  }
  // 恢复滚动位置
  onActivated(() => {
    listRefs.value.forEach((el, index) => {
      if (el) {
        el.scrollTop = scrollTops.value[index]
      }
    })
  })
  // 记录滚动位置
  onBeforeRouteLeave(() => {
    listRefs.value.forEach((el, index) => {
      scrollTops.value[index] = el.scrollTop
    })
  })

  return {
    scrollTops,
    listRefs,
    setListRefs
  }
}
