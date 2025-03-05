import { createApp } from 'vue'
import App from './App.vue'

// 引入插件
import importRouter from '@/router/importRouter'
import importStores from '@/stores/importStores'
import importVant from '@/vant/importVant'
import importLocales from '@/locales/importLocales'

// css
import '@/assets/styles/reset.scss'
import '@/assets/styles/production.scss'
import '@/assets/styles/common.scss'

const app = createApp(App)

// 引入router
importRouter(app)
// 引入stores
importStores(app)
// 引入vant
importVant(app)
// 引入locales
importLocales(app)

app.mount('#app')

console.log('------------------------------------')
console.log('开发环境', import.meta.env.DEV)
console.log('打包环境', import.meta.env.PROD)
console.log('服务器环境', import.meta.env.MODE)
console.log('------------------------------------')
