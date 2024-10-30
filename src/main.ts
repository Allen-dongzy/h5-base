import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import i18n from './locales'

// css
import '@/assets/styles/reset.scss'
import '@/assets/styles/production.scss'
import '@/assets/styles/common.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)

app.mount('#app')

console.log('------------------------------------')
console.log('开发环境', import.meta.env.DEV)
console.log('打包环境', import.meta.env.PROD)
console.log('服务器环境', import.meta.env.MODE)
console.log('------------------------------------')
