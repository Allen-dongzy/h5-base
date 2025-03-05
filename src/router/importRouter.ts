import type { App } from 'vue'
import router from '@/router/index'

const importRouter = (app: App<Element>) => {
  app.use(router)
}

export default importRouter
