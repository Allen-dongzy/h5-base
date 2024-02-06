import { onUpdated, ref } from 'vue'

export default () => {
  // 表格滚动条区域的高度
  const tableHeight = ref<number | string | undefined>(undefined)
  // 过滤条元素
  const filterAreaRef = ref<HTMLElement | null>()

  onUpdated(() => {
    const pageContent = document.getElementsByClassName('layout-content-main')[0]
    const fliterBar = filterAreaRef.value

    const pageContentHeight = pageContent.clientHeight
    const pageContentPaddingTop = 30
    const filterBarHeight = fliterBar ? fliterBar.clientHeight : 0
    const tableMarginTop = 30
    const tableHeadHeight = 55
    const paginationHeight = 64

    tableHeight.value = pageContentHeight - pageContentPaddingTop - filterBarHeight - tableMarginTop - tableHeadHeight - paginationHeight
  })

  return { tableHeight, filterAreaRef }
}