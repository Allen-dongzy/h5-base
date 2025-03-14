import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const importStores = (app: App<Element>) => {
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  app.use(pinia)
}

export default importStores
