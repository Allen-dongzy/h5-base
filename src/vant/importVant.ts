import 'vant/lib/index.css'
import type { App } from 'vue'
import { Button, Icon } from 'vant'

const importVant = (app: App<Element>) => {
  app.use(Button)
  app.use(Icon)
}

export default importVant
