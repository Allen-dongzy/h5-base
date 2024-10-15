<script setup lang="ts">
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue'

interface State {
  id: string
  url: string
  width: number
  height: number
  previewVisible: boolean
}
interface Props {
  state: State
}
const props = withDefaults(defineProps<Props>(), {
  state: () => ({
    id: '',
    url: '',
    width: 150,
    height: 150,
    previewVisible: false
  })
})
const emit = defineEmits(['update:state', 'delete'])

// 图片状态
const pictureState = computed({
  get: () => {
    return props.state
  },
  set: (val) => {
    emit('update:state', val)
  }
})
// 图片预览切换
const setPreviewVisible = (visible: boolean) => {
  pictureState.value.previewVisible = visible
}
// 删除图片
const deletePicture = (picture: State) => {
  emit('delete', picture)
}
</script>

<template>
  <div class="picture">
    <a-image
      :width="150"
      :height="150"
      :src="pictureState.url"
      :preview="{
        visible: pictureState.previewVisible,
        onVisibleChange: setPreviewVisible
      }"
    >
      <template #previewMask>
        <a-space :size="15">
          <eye-outlined class="icon" @click.stop="setPreviewVisible(true)" />
          <delete-outlined class="icon" @click.stop="deletePicture(pictureState)" />
        </a-space>
      </template>
    </a-image>
    <span></span>
  </div>
</template>

<style scoped lang="scss">
.picture {
  :deep(img) {
    object-fit: cover;
  }
  .icon {
    font-size: 20px;
  }
}
</style>
