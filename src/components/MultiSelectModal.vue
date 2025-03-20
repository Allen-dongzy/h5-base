<script setup lang="ts">
interface ListItem {
  text: string
  value: string | number
  isExpand?: boolean
  expandContent?: string
}

interface MultiSelectModalProps {
  title?: string
  subtitle?: string
  list: Array<ListItem>
}

const props = withDefaults(defineProps<MultiSelectModalProps>(), {
  title: '多选框',
  subtitle: '可多选'
})

const emit = defineEmits(['confirm'])

// 选中的选项
const values = defineModel<Array<string | number>>('values')
// 扩展内容
const expandContent = defineModel<string>('expandContent')

const show = defineModel<boolean>('show')

// 选择
const select = (item: ListItem) => {
  const index = values.value!.indexOf(item.value)
  if (index > -1) {
    values.value!.splice(index, 1)
    if (item.isExpand) {
      expandContent.value = ''
      console.log('000', expandContent.value)
    }
  } else {
    values.value!.push(item.value)
    if (item.isExpand) {
      expandContent.value = item.expandContent
      console.log('111', expandContent.value)
    }
  }
}

// 确定
const confirm = () => {
  emit('confirm')
  close()
}

// 关闭
const close = () => {
  show.value = false
}
</script>
<template>
  <div class="multi-select-modal">
    <van-popup v-model:show="show" destroy-on-close round position="bottom">
      <div class="multi-select-head flex-row-sb">
        <div class="icon-box flex-row-center"></div>
        <div class="title flex-row-center">{{ props.title }}</div>
        <div class="icon-box flex-row-center" @click="close">
          <img src="@/assets/imgs/icon-close.png" class="icon" />
        </div>
      </div>
      <div class="multi-select-sub-head flex-row-center">可多选</div>
      <div class="multi-select-content">
        <div class="list">
          <template v-for="(item, index) in props.list" :key="index">
            <div class="item flex-row-sb" @click="select(item)">
              <div class="title">{{ item.text }}</div>
              <img
                v-if="values!.indexOf(item.value) > -1"
                src="@/assets/imgs/icon-selected.png"
                class="icon"
              />
              <img v-else src="@/assets/imgs/icon-select.png" class="icon" />
            </div>
            <van-field
              v-if="item?.isExpand"
              v-model="item.expandContent"
              rows="2"
              autosize
              type="textarea"
              maxlength="100"
              placeholder="请输入..."
              @blur="
                () => {
                  expandContent = item.expandContent
                }
              "
            />
          </template>
        </div>
        <div class="btn-box flex-row-center">
          <van-button class="btn" type="primary" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
.multi-select-modal {
  .multi-select-head {
    padding-top: 40px;
    padding-bottom: 20px;
    .title {
      width: calc(100% - 192px);
      height: 100%;
      font-family: PingFang SC;
      font-size: 28px;
      line-height: 30px;
      letter-spacing: 0.88px;
    }
    .icon-box {
      width: 96px;
      height: 100%;
      .icon {
        width: 28px;
        height: 28px;
      }
    }
  }
  .multi-select-sub-head {
    padding-bottom: 28px;
    position: relative;
    font-family: PingFang SC;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: 0.88px;
    color: #999999;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 690px;
      height: 1px;
      background-color: #efedef;
    }
  }
  .multi-select-content {
    .list {
      height: 804px;
      overflow-y: auto;
      padding: 0 40px;
      .item {
        padding: 35px 0;
        .icon {
          width: 34px;
          height: 34px;
        }
        & + .item {
          border-top: 1px solid #efedef;
        }
        .title {
          font-family: PingFang SC;
          font-size: 26px;
          letter-spacing: 0.65px;
          color: #666666;
        }
      }
      .van-cell.van-field {
        border: 1px solid #e6e6e6;
        font-family: Avenir Next;
        font-size: 24px;
        color: #999999;
      }
    }
    .btn-box {
      padding: 20px 40px 0;
      padding-bottom: calc(constant(safe-area-inset-bottom));
      padding-bottom: calc(env(safe-area-inset-bottom));
      @supports not (constant(safe-area-inset-bottom)) {
        padding-bottom: 68px;
      }
      .btn {
        width: 670px;
        --van-button-default-height: 80px;
        --van-button-default-color: #003594;
        --van-button-default-border-color: #003594;
        font-size: 26px;
        & + .btn {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
