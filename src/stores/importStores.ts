import { createPinia } from 'pinia'
import type { App } from 'vue'

const importStores = (app: App<Element>) => {
  app.use(createPinia())
}

export default importStores