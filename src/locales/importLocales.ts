import type { App } from 'vue'
import locales from '@/locales/index'

const importLocales = (app: App<Element>) => {
  app.use(locales)
}

export default importLocales
