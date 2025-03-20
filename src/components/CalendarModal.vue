<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { showToast, type CalendarInstance } from 'vant'

interface CalendarModalProps {
  title?: string
  type?: 'range' | 'single'
  date?: Dayjs | [Dayjs, Dayjs]
}

const props = withDefaults(defineProps<CalendarModalProps>(), {
  title: '日期筛选',
  type: 'single'
})

const emit = defineEmits(['confirm'])

const show = defineModel<boolean>('show')

// 选中的日期
const selectedDate = ref<Dayjs>()
const selectedDates = ref<[Dayjs, Dayjs]>()

// 日历实例
const calendarRef = ref<CalendarInstance>()

// 监听日期和可见性变化
watch(
  () => [props.date, show.value],
  () => {
    if (!show.value) return
    if (props.type === 'single' && dayjs.isDayjs(props.date)) {
      const date = props.date as Dayjs
      selectedDate.value = date
      nextTick(() => {
        calendarRef.value?.reset(date.toDate())
      })
    }
    if (
      props.type === 'range' &&
      Array.isArray(props.date) &&
      dayjs.isDayjs(props.date?.[0]) &&
      dayjs.isDayjs(props.date?.[1])
    ) {
      selectedDates.value = props.date
      const date = props.date as [Dayjs, Dayjs]
      nextTick(() => {
        calendarRef.value?.reset([date[0].toDate(), date[1].toDate()])
      })
    }
  },
  { immediate: true, deep: true }
)

// 选择
const select = (date: Date | [Date, Date]) => {
  if (props.type === 'single') {
    selectedDate.value = dayjs(date as Date).startOf('day')
  }
  if (props.type === 'range' && Array.isArray(date) && date.length === 2) {
    selectedDates.value = [dayjs(date[0]).startOf('day'), dayjs(date[1]).startOf('day')]
  }
}

// 重置
const reset = () => {
  selectedDate.value = dayjs().startOf('day')
  selectedDates.value = [dayjs().startOf('day'), dayjs().endOf('day')]
  calendarRef.value?.reset()
}

// 确定
const confirm = () => {
  if (props.type === 'single') {
    if (!selectedDate.value) {
      showToast('请选择日期')
      return
    }
    emit('confirm', selectedDate.value as Dayjs)
  }
  if (props.type === 'range') {
    if (!selectedDates.value || !selectedDates.value[0] || !selectedDates.value[1]) {
      showToast('请选择开始日期和结束日期')
      return
    }
    emit('confirm', selectedDates.value as [Dayjs, Dayjs])
  }
  close()
}

// 关闭
const close = () => {
  show.value = false
}
</script>

<template>
  <div class="calendar-modal">
    <van-popup v-model:show="show" destroy-on-close round position="bottom">
      <div class="calendar-head flex-row-sb">
        <div class="icon-box flex-row-center"></div>
        <div class="title flex-row-center">{{ props.title }}</div>
        <div class="icon-box flex-row-center" @click="close">
          <img src="@/assets/imgs/icon-close.png" class="icon" />
        </div>
      </div>
      <div class="calendar-content">
        <van-calendar
          class="calendar-self"
          ref="calendarRef"
          :type="props.type"
          :poppable="false"
          :show-confirm="false"
          :show-title="false"
          :show-mark="false"
          :min-date="dayjs().subtract(1, 'year').startOf('month').toDate()"
          :max-date="dayjs().add(1, 'year').endOf('month').toDate()"
          allow-same-day
          @select="select"
        >
          <template #text="{ date }">
            <div class="date flex-row-center">{{ date.getDate() }}</div>
          </template>
        </van-calendar>
        <div class="btn-box flex-row-sb">
          <van-button class="btn reset" type="default" @click="reset">重置</van-button>
          <van-button class="btn" type="primary" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
.calendar-modal {
  .calendar-head {
    position: relative;
    height: 96px;
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
  .calendar-content {
    .calendar-self {
      height: 850px;
    }
    :deep(.van-calendar) {
      .van-calendar__header,
      .van-calendar__body {
        padding: 0 20px;
        box-shadow: none;
      }
      .van-calendar__header-subtitle {
        --van-calendar-header-subtitle-font-size: 26px;
        --van-calendar-header-title-height: 116px;
        font-weight: 500;
        color: #333333;
      }
      .van-calendar__month-title {
        --van-text-color: #333333;
        --van-calendar-header-title-height: 116px;
        font-size: 26px;
        font-weight: 500;
        color: #333333;
      }
      .van-calendar__weekday {
        --van-calendar-weekdays-font-size: 26px;
        --van-calendar-weekdays-height: 60px;
        font-family: Avenir Next;
        font-weight: 500;
        line-height: 100%;
        color: #666666;
      }
      .van-calendar__days {
        padding-top: 20px;
      }
      .van-calendar__day {
        font-size: 26px;
        color: #666666;
        height: 98px;
        margin-bottom: 0;
        .date {
          width: 68px;
          height: 68px;
          border-radius: 50%;
        }
      }
      .van-calendar__day--start,
      .van-calendar__day--end,
      .van-calendar__day--start-end,
      .van-calendar__day--selected,
      .van-calendar__selected-day {
        color: #ffffff;
        background-color: #ffffff;
        .date {
          background-color: #003594;
        }
      }
      .van-calendar__day--middle {
        &::after {
          background-color: #ffffff;
        }
        .date {
          background-color: #0035941a;
        }
      }
      .van-calendar__day--disabled {
        color: #dddddd;
      }
      .van-calendar__bottom-info {
        display: none;
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
        width: 325px;
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
