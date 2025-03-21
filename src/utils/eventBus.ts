import mitt, { type Emitter } from 'mitt'

type EventReturnType = {
  [key: string]: any
}

type Events = {
  // 事件名
  someEvent: Partial<EventReturnType>
}

const eventBus: Emitter<Events> = mitt<Events>()

// 示例
// eventBus.emit('someEvent', {})
// eventBus.on('someEvent', (event) => {
//   console.log(event)
// })

export default eventBus
