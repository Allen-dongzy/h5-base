import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


// 路由meta信息
export interface RouteRecordMeta extends Record<string, any> {
  title: string
  icon: any // 图标 antd-vue的icon组件
  noLayoutContent: boolean // 容器是否加一个layout-content类
  roles: string[]
  hide: boolean
  keepAlive: boolean
}

// 路由记录
export interface RouteRecord extends Record<string, any> {
  path: string
  name: string
  redirect?: string
  component?: () => Promise<typeof import('*.vue')>
  meta?: Partial<RouteRecordMeta>
  children?: Array<RouteRecord>
}

// 路由记录列表
export const routes: Array<RouteRecord> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/route1',
    meta: {
      title: 'H5-base'
    },
    children: []
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFind',
    component: () => import('@/views/NotFind.vue')
  }
]

// 如果服务器环境是dev和uat才添加debug路由
if (['dev', 'uat'].includes(import.meta.env.MODE)) {
  routes.push({
    path: '/debug',
    name: 'Debug',
    component: () => import('@/views/Debug.vue')
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[]
})

export default router
