import { debounce } from '@/utils/tools'
import { onUpdated, ref } from 'vue'

interface TableHeightProps {
  tableHeaderHeight?: number
  tablePaginationHeight?: number
  otherHeight?: number
}

export default (props?: TableHeightProps) => {
  // 表格头部高度
  const tableHeaderHeight = props?.tableHeaderHeight !== undefined ? props.tableHeaderHeight : 55
  // 分页器高度
  const tablePaginationHeight = props?.tablePaginationHeight !== undefined ? props.tablePaginationHeight : 64
  // 其他高度
  const otherHeight = props?.otherHeight !== undefined ? props.otherHeight : 20

  // 表格容器ref
  const tableContentRef = ref<HTMLElement | null>(null)
  // 表格滚动条区域的高度
  const tableHeight = ref(0)

  // 设置表格高度
  const setTableHeight = debounce(() => {
    if (!tableContentRef.value) return
    tableHeight.value =
      tableContentRef.value.offsetHeight -
      tableHeaderHeight -
      tablePaginationHeight -
      otherHeight
  }, 100)

  onMounted(() => {
    setTableHeight()
  })

  // 窗口大小变化
  window.addEventListener('resize', () => {
    setTableHeight()
  })

  return { tableHeight, tableContentRef }
}